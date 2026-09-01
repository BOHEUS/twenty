import { defineLogicFunction } from 'twenty-sdk/define';
import axios, { type AxiosInstance, isAxiosError } from "axios";
import { isString } from "@sniptt/guards";
import { getConnection, kv, RetryableLogicFunctionError } from "twenty-sdk/logic-function";
import { CoreApiClient } from "twenty-client-sdk/core";
import { type TaskListsResponse, type TasksResponse } from "src/logic-functions/types";
import { buildSyncPlan } from "src/logic-functions/utils/build-sync-plan.util";
import { createTasks } from "src/logic-functions/utils/create-tasks.util";
import { updateTasks } from "src/logic-functions/utils/update-tasks.util";
import { executeWithRetry } from "src/logic-functions/utils/execute-with-retry.util";
import { SYNC_TASKS_LOGIC_FUNCTION_UNIVERSAL_IDENTIFIER } from "src/constants/universal-identifiers";
import { GOOGLE_TASKS_BASE_API_URL, GOOGLE_TASKS_PAGE_SIZE } from "src/constants/sync";

type SyncTasksPayload = {
  connectionId?: string;
};

const lastSyncedAtKey = (connectionId: string) => `sync:lastSyncedAt:${connectionId}`;

// Google answers 429 and 5xx under load, and a timeout leaves the run
// half-done; all three are worth another attempt rather than waiting out the
// next cron tick.
const isTransient = (error: unknown) => {
  if (!isAxiosError(error)) {
    return false;
  }

  const status = error.response?.status;

  return (
    error.code === 'ECONNABORTED' ||
    status === 429 ||
    (status !== undefined && status >= 500)
  );
};

const syncTaskList = async (
  axiosInstance: AxiosInstance,
  client: CoreApiClient,
  assigneeId: string,
  listId: string,
  updatedMin: string | null,
) => {
  const counts = { created: 0, updated: 0 };
  let pageToken: string | undefined;

  do {
    const response = await executeWithRetry(() => axiosInstance.get<TasksResponse>(
      `/tasks/v1/lists/${listId}/tasks`,
      {
        params: {
          maxResults: GOOGLE_TASKS_PAGE_SIZE,
          // Deletions are deliberately not fetched: the CRM keeps its record
          // either way, so a tombstone is only bytes to skip. showHidden is
          // required or a task the user ticks off in Google vanishes from the
          // response instead of syncing as DONE.
          showHidden: true,
          showCompleted: true,
          ...(isString(updatedMin) ? { updatedMin } : {}),
          ...(pageToken === undefined ? {} : { pageToken }),
        },
      },
    ));

    const googleTasks = response.data.items ?? [];
    const plan = await buildSyncPlan(client, googleTasks);

    await createTasks(client, assigneeId, plan.tasksToCreate);
    await updateTasks(client, plan.tasksToUpdate);

    counts.created += plan.tasksToCreate.length;
    counts.updated += plan.tasksToUpdate.length;

    pageToken = response.data.nextPageToken;
  } while (pageToken !== undefined);

  return counts;
};

const handler = async ({ connectionId }: SyncTasksPayload) => {
  if (!isString(connectionId)) {
    return {
      success: false,
      error: 'Missing connectionId',
    };
  }

  const connection = await executeWithRetry(() => getConnection(connectionId));
  const assigneeId = connection.workspaceMemberId;

  if (assigneeId === null) {
    return {
      success: false,
      error: 'Connection has no workspace member',
    };
  }

  const client = new CoreApiClient();
  const axiosInstance = axios.create({
    baseURL: GOOGLE_TASKS_BASE_API_URL,
    timeout: 10000,
    headers: {
      Authorization: `Bearer ${connection.accessToken}`,
    },
  });

  // Captured before any request so a task changed mid-run is picked up by the
  // next one rather than falling into the gap.
  const startedAt = new Date().toISOString();
  const updatedMin = await executeWithRetry(() =>
    kv.get<string>(lastSyncedAtKey(connectionId)),
  );

  const totals = { created: 0, updated: 0 };

  try {
    const listsResponse = await executeWithRetry(() =>
      axiosInstance.get<TaskListsResponse>('/tasks/v1/users/@me/lists'),
    );

    for (const list of listsResponse.data.items ?? []) {
      const counts = await syncTaskList(
        axiosInstance,
        client,
        assigneeId,
        list.id,
        updatedMin,
      );

      totals.created += counts.created;
      totals.updated += counts.updated;
    }
  } catch (error) {
    if (isTransient(error)) {
      throw new RetryableLogicFunctionError(
        `Google Tasks is temporarily unavailable for connection ${connectionId}: ${(error as Error).message}`,
      );
    }

    throw error;
  }

  // Only advances on a fully successful pass, so a failed run re-reads the
  // same window instead of skipping it.
  await executeWithRetry(() => kv.set(lastSyncedAtKey(connectionId), startedAt));

  return {
    success: true,
    ...totals,
  };
};

export default defineLogicFunction({
  universalIdentifier: SYNC_TASKS_LOGIC_FUNCTION_UNIVERSAL_IDENTIFIER,
  name: 'sync-tasks',
  description: 'Syncs Google Tasks into Twenty for one user connection',
  timeoutSeconds: 900,
  handler
});

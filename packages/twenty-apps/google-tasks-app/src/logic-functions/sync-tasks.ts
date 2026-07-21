import { defineLogicFunction } from 'twenty-sdk/define';
import axios from 'axios';
import { listConnections } from 'twenty-sdk/logic-function';
import { CoreApiClient } from 'twenty-client-sdk/core';
import { findTask } from "src/logic-functions/data/find-task.util";
import { createTask } from "src/logic-functions/data/create-task.util";
import { deleteTask } from "src/logic-functions/data/delete-task.util";
import { updateTask } from "src/logic-functions/data/update-task.util";
import { findUser } from "src/logic-functions/data/find-user.util";

const BASE_API_URL = 'https://tasks.googleapis.com';

type taskListsResponse = {
  items: taskList[];
};

type taskList = {
  id: string;
  title: string;
  selfLink: string;
};

type tasksResponse = {
  items: task[];
};

type task = {
  id: string;
  title: string;
  updated: string;
  deleted: boolean;
  completed?: string;
  notes?: string;
  due?: string;
};

const handler = async () => {
  const connections = await listConnections({ providerName: 'google-tasks' });
  const connection = connections.find((c) => c.visibility === 'user');
  console.log(connection);
  if (!connection) {
    return {
      success: false,
      error: 'Missing personal sync connection',
    };
  }
  const client = new CoreApiClient();
  const workspaceMemberId = <string>(await findUser(client, connection.handle)).workspaceMembers?.edges[0].node.id;
  const axiosInstance = axios.create({
    baseURL: BASE_API_URL,
    timeout: 10000,
    headers: {
      Authorization: `Bearer ${connection.accessToken}`,
    },
  });

  const listsResponse = await axiosInstance.get('/tasks/v1/users/@me/lists');
  if (!listsResponse || listsResponse.data === null) {
    return {
      success: false,
      error: 'Failed to fetch lists',
    };
  }

  const taskLists = listsResponse.data as unknown as taskListsResponse;
  for (const list of taskLists.items) {
    const googleTasksResponse = await axiosInstance.get(
      `/tasks/v1/lists/${list.id}/tasks`,
    );

    if (!googleTasksResponse || googleTasksResponse.data == null) {
      continue;
    }

    const tasks = googleTasksResponse.data as unknown as tasksResponse;
    for (const task of tasks.items) {
      const checkTask = await findTask(client, task.id);

      if (checkTask.tasks?.edges.length === 0 && !task.deleted) {
        await createTask(client, workspaceMemberId, task.id, task.title, task.notes, task.due, task.completed);
      } else {
        if (task.deleted) {
          await deleteTask(client, task.id);
        } else {
          if (
            task.title !== checkTask.tasks?.edges[0].node.title ||
            (task.notes ?? null) !== checkTask.tasks?.edges[0].node.bodyV2?.markdown ||
            (task.due ?? null) !== checkTask.tasks?.edges[0].node.dueAt ||
            ((task.completed && checkTask.tasks?.edges[0].node.status !== 'DONE') ||
              (!task.completed) && checkTask.tasks?.edges[0].node.status === 'TODO')
          ) {
            await updateTask(client, task.id, task.title, task.notes, task.due, task.completed);
          }
        }
      }
    }
  }

  return {
    success: true,
  }
};

export default defineLogicFunction({
  universalIdentifier: 'e35d95c3-655b-46e6-ab58-f985ea429717',
  name: 'sync-tasks',
  description: 'Syncs tasks from Google',
  timeoutSeconds: 600,
  handler,
  cronTriggerSettings: {
    pattern: '*/15 * * * *',
  },
});

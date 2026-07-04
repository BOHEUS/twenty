import { defineLogicFunction } from 'twenty-sdk/define';
import axios from 'axios';
import { listConnections } from 'twenty-sdk/logic-function';
import { CoreApiClient } from 'twenty-client-sdk/core';

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

  if (!connection) {
    return {
      success: false,
      error: 'Missing personal sync connection',
    };
  }

  const client = new CoreApiClient();
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
      const checkTask = await client.query({
        tasks: {
          __args: {
            filter: {
              id: {
                eq: task.id,
              },
            },
          },
          edges: {
            node: {
              id: true,
              title: true,
              bodyV2: {
                markdown: true,
              },
              deletedAt: true,
              dueAt: true,
              status: true,
            },
          },
        },
      });

      if (checkTask.tasks?.edges.length === 0 && !task.deleted) {
        await client.mutation({
          createTask: {
            __args: {
              data: {
                assigneeId: connection.userWorkspaceId,
                id: task.id,
                bodyV2: {
                  markdown: task.notes,
                },
                dueAt: task.due,
                title: task.title,
                status: task.completed ? 'DONE' : "TODO",
              },
            },
          },
        });
      } else {
        if (task.deleted) {
          await client.mutation({
            deleteTask: {
              __args: {
                id: task.id,
              },
            },
          });
        } else {
          if (
            task.title !== checkTask.tasks?.edges[0].node.title ||
            task.notes !== checkTask.tasks?.edges[0].node.bodyV2?.markdown ||
            task.due !== checkTask.tasks?.edges[0].node.dueAt ||
            ((task.completed && checkTask.tasks?.edges[0].node.status !== 'DONE') ||
              (!task.completed) && checkTask.tasks?.edges[0].node.status === 'TODO')
          ) {
            await client.mutation({
              updateTask: {
                __args: {
                  data: {
                    title: task.title,
                    bodyV2: {
                      markdown: task.notes,
                    },
                    dueAt: task.due,
                    status: task.completed ? 'DONE' : 'TODO',
                  },
                  id: task.id,
                },
              },
            });
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
  timeoutSeconds: 5,
  handler,
  cronTriggerSettings: {
    pattern: '*/15 * * * *',
  },
});

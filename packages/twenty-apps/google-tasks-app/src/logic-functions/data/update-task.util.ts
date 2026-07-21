import { CoreApiClient } from "twenty-client-sdk/core";

export const updateTask = async (client: CoreApiClient, googleTasksId: string, title: string, markdown?: string, due?: string, completed?: string) => {
  await client.mutation({
    updateTasks: {
      __args: {
        data: {
          title,
          bodyV2: {
            markdown: markdown ?? null,
          },
          dueAt: due ?? null,
          status: completed ? 'DONE' : 'TODO',
        },
        filter: {
          googleTasksId: {
            eq: googleTasksId,
          }
        }
      },
    },
  });
}
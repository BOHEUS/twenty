import { type CoreApiClient } from "twenty-client-sdk/core";

export const createTask = async (client: CoreApiClient, assigneeId: string, googleTasksId: string, title: string, markdown?: string, due?: string, completed?: string) => {
  console.log("Create task", assigneeId, googleTasksId, title, markdown, due, completed);
  await client.mutation({
    createTask: {
      __args: {
        data: {
          assigneeId,
          googleTasksId,
          bodyV2: {
            markdown: markdown ?? null,
          },
          dueAt: due ?? null,
          title,
          status: completed ? 'DONE' : "TODO",
        },
      },
    },
  });
}
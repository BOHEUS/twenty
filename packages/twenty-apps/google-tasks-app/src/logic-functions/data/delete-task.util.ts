import { type CoreApiClient } from "twenty-client-sdk/core";

export const deleteTask = async (client: CoreApiClient, googleTasksId: string) => {
  await client.mutation({
    deleteTasks: {
      __args: {
        filter: {
          googleTasksId: {
            eq: googleTasksId,
          }
        }
      },
      id: true,
    },
  });
}
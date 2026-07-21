import { type CoreApiClient } from "twenty-client-sdk/core";

export const findTask = async (client: CoreApiClient, id: string)=> {
  return await client.query({
    tasks: {
      __args: {
        filter: {
          googleTasksId: {
            eq: id,
          },
        },
      },
      edges: {
        node: {
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
}
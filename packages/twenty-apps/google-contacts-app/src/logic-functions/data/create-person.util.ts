import { type CoreApiClient } from "twenty-client-sdk/core";

export const createPerson = async (client: CoreApiClient, data: any) => {
  await client.mutation({
    createPerson: {
      __args: {
        data
      }
    }
  })
}
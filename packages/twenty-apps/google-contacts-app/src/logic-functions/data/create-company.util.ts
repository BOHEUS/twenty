import { type CoreApiClient } from "twenty-client-sdk/core";

export const createCompany = async (client: CoreApiClient, data: any) => {
  await client.mutation({
    createCompany: {
      __args: {
        data
      }
    }
  })
}
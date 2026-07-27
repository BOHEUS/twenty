import { type CoreApiClient } from "twenty-client-sdk/core";

export const updateCompany = async (client: CoreApiClient, data: any) => {
  await client.mutation({
    updateCompanies: {
      __args: {
        data,
        filter: { // ???
        }
      }
    }
  })
}
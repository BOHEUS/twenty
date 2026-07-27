import { type CoreApiClient } from "twenty-client-sdk/core";

export const updatePerson = async (client: CoreApiClient, data: any, id: string) => {
  await client.mutation({
    updatePeople: {
      __args: {
        data,
        filter: {
          googleContactsId: {
            eq: id,
          }
        }
      }
    }
  })
}
import { type CoreApiClient } from "twenty-client-sdk/core";

export const findPersonByGoogleId = async (client: CoreApiClient, id: string) => {
  return await client.query({
    people: {
      __args: {
        filter: {
          googleContactsId: {
            eq: id
          }
        }
      },
      countNotEmptyId: true,
    }
  })
}
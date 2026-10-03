import { CoreApiClient } from "twenty-client-sdk/core";

export const findMessageById = async (client: CoreApiClient, id: string) => {
  return await client.query({
    message: {
      __args: {
        filter: {
          id: {
            eq: id
          }
        }
      },
      text: true,
    }
  })
}
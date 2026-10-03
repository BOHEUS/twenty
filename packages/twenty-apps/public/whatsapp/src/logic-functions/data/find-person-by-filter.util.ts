import { type CoreApiClient } from 'twenty-client-sdk/core';

export const findPersonByFilter = async (client: CoreApiClient, whatsAppId: string) => {
  return await client.query({
    people: {
      __args: {
        filter: {
          whatsAppId: {
            eq: whatsAppId,
          },
        }
      },
      edges: {
        node: {
          id: true,
        }
      },
      totalCount: true
    }
  })
}
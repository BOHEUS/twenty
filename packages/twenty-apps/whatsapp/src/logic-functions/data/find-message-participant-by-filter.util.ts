import { CoreApiClient } from 'twenty-client-sdk/core';

export const findMessageParticipant = async (client: CoreApiClient, personId: string) => {
  return await client.query({
    messageParticipants: {
      __args: {
        filter: {
          personId: {
            eq: personId
          }
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
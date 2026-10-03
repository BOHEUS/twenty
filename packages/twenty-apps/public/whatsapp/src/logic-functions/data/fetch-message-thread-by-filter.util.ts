import { CoreApiClient } from 'twenty-client-sdk/core';

export const fetchMessageThreadByFilter = async (client: CoreApiClient, messageThreadId: string) => {
  return await client.query({
    messageThreads: {
      __args: {
        filter: {
          id: {
            eq: messageThreadId,
          }
        }
      },
      edges: {
        node: {
          id: true,
        }
      }
    }
  })
}
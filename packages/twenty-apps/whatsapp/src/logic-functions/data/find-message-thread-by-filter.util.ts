import { type CoreApiClient } from 'twenty-client-sdk/core';

export const findMessageThreadByFilter = async (client: CoreApiClient) => {
  return await client.query({
    messageThreads: {
      __args: {
        filter: {

        }
      }
    }
  })
}
import { type CoreApiClient } from 'twenty-client-sdk/core';

export const createMessageThread = async (client: CoreApiClient) => {
  return await client.mutation({
    createMessageThread: {
      __args: {
        data: {}
      }
    }
  })
}
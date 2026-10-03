import { type CoreApiClient } from 'twenty-client-sdk/core';

export const createMessage = async (client: CoreApiClient) => {
  return await client.mutation({
    createMessage: {
      __args: {
        data: {

        }
      },
      id: true,
    }
  })
}
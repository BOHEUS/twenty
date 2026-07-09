import { type CoreApiClient } from 'twenty-client-sdk/core';

export const createMessageParticipant = async (client: CoreApiClient) => {
  return await client.mutation({
    createMessageParticipant: {
      __args: {
        data: {},
        upsert: false,
      },
    },
  });
};

import { MetadataApiClient } from 'twenty-client-sdk/metadata';

export const addConnectedAccount = async () => {
  const client = new MetadataApiClient();
  await client.query({
    myConnectedAccounts: {

    }
  });
  await client.mutation({

  })
};
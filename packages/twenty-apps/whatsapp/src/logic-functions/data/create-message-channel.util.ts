import { type MetadataApiClient } from "twenty-client-sdk/metadata";

export const createMessageChannel = async (client: MetadataApiClient) => {
  await client.mutation({
    createMessageChannel: {

    }
  })
}

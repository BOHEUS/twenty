import { type MetadataApiClient } from "twenty-client-sdk/metadata";

export const fetchMessageChannelByFilter = async (client: MetadataApiClient) => {
  await client.query({})
}
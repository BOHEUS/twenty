import { type MetadataApiClient } from 'twenty-client-sdk/metadata';

export const findConnectedAccount = async (client: MetadataApiClient, handle: string) => {
  return await client.query({
    workspaceConn
  })
}
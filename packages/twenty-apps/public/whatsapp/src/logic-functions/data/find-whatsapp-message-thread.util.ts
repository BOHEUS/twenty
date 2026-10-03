import { CoreApiClient } from "twenty-client-sdk/core";

export const findWhatsappMessageThread = async (client: CoreApiClient) => {
  return await client.query({});
}
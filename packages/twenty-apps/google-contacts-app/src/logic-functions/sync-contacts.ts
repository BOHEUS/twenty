import { defineLogicFunction } from 'twenty-sdk/define';
import { CoreApiClient } from "twenty-client-sdk/core";
import  axios  from "axios";
import { listConnections } from "twenty-sdk/logic-function";
import { prepareUrl } from "src/logic-functions/data/prepare-url.util";

type GoogleResponse = {
  connections: GooglePerson[],
  nextPageToken: string;
  nextSyncToken: string;
  totalItems: number;
}

type GooglePerson = {

}

const handler = async () => {
  const connections = await listConnections({providerName: 'google-contacts'});
  const connection = connections.find((c) => c.visibility === 'user')

  if (!connection) {
    return {
      success: false,
      error: 'Missing user connection',
    }
  }

  const client = new CoreApiClient();
  const axiosInstance = axios.create({
    baseURL: 'https://people.googleapis.com/v1/people/me',
    timeout: 10000,
    headers: {
      'Authorization': `Bearer ${connection.accessToken}`,
    }
  });

  const googleResponse = await axiosInstance.get(prepareUrl())
  return;
};

export default defineLogicFunction({
  universalIdentifier: '8707786f-b1b1-4cf8-a614-63f498460c6d',
  name: 'sync-contacts',
  description: 'Add a description for your logic function',
  timeoutSeconds: 5,
  handler,
    cronTriggerSettings: {
       pattern: '*/15 * * * *',
    },
});

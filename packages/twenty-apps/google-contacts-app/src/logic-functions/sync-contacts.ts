import { defineLogicFunction } from 'twenty-sdk/define';
import { CoreApiClient } from "twenty-client-sdk/core";
import axios from "axios";
import { listConnections } from "twenty-sdk/logic-function";
import { prepareUrl } from "src/logic-functions/data/prepare-url.util";
import { ListConnectionsResponse, Person } from "src/logic-functions/types/google-response.type";
import { findPersonByGoogleId } from "src/logic-functions/data/find-person-by-google-id.util";

const PAGE_SIZE = 200;

type PersonAgg = {
  name: {
    firstName?: string;
    lastName?: string;
  }
  emails: {
    primaryEmail?: string;
    additionalEmails?: string[];
  }
  phones?: {
    primaryPhoneNumber: string;
    primaryPhoneCallingCode: string;
    primaryPhoneCountryCode: string;
  }
}
const aggPerson = (data: Person): PersonAgg => {

}

const chunk = <T>(items: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
};

const handler = async () => {
  const connections = await listConnections({ providerName: 'google-contacts' });
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

  let after;
  try {
    do {
      const googleResponse = await axiosInstance.get<ListConnectionsResponse>(prepareUrl());
      console.log(googleResponse.data.connections[0]);
      const peopleToCreate: Person[] = [];
      for (const personChunk of chunk(googleResponse.data.connections, PAGE_SIZE)) {
        for (const person in personChunk) {

        }
      }
      for (const person of googleResponse.data.connections) {
        const ifPersonExists = await findPersonByGoogleId(client, person.resourceName.slice(6));
        if (ifPersonExists.people?.countNotEmptyId === 0) {

        }
        person.names[0].displayNameLastFirst.split(',', 2);

      }
      after = googleResponse.data.nextPageToken;
    }
    while (after);
    return;
  } catch (error: any) {
    console.error(error.response.data.error);
    return;
  }
};

export default defineLogicFunction({
  universalIdentifier: '8707786f-b1b1-4cf8-a614-63f498460c6d',
  name: 'sync-contacts',
  description: 'Add a description for your logic function',
  timeoutSeconds: 900,
  handler,
  cronTriggerSettings: {
    pattern: '*/15 * * * *',
  },
});

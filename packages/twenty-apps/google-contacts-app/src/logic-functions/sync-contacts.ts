import { defineLogicFunction } from 'twenty-sdk/define';
import { CoreApiClient } from "twenty-client-sdk/core";
import axios from "axios";
import { listConnections } from "twenty-sdk/logic-function";
import { prepareUrl } from "src/logic-functions/data/prepare-url.util";
import { ListConnectionsResponse, Person } from "src/logic-functions/types/google-response.type";
import { parsePhoneNumberWithError } from "libphonenumber-js";

const PAGE_SIZE = 200;

type PersonAgg = {
  name?: {
    firstName?: string;
    lastName?: string;
  }
  emails: {
    primaryEmail: string;
    additionalEmails: string[];
  }
  phones?: {
    primaryPhoneNumber: string;
    primaryPhoneCallingCode: string;
    primaryPhoneCountryCode: string;
  }
  googleContactsId?: string;
  linkedinLink?: {
    primaryLinkLabel: string;
    primaryLinkUrl: string;
  }
  xLink?: {
    primaryLinkLabel: string;
    primaryLinkUrl: string;
  }
  jobTitle?: string;
}

const aggPerson = (data: Person, agg: PersonAgg): PersonAgg => {
  if (data.phoneNumbers) {
    const parsedPhone = parsePhoneNumberWithError(data.phoneNumbers[0].canonicalForm);
    let additionalPhones = '';
    if (data.phoneNumbers.length > 1) {
      for (let i = 1; i < data.phoneNumbers.length; i++) {
        const parsedAdditionalPhone = parsePhoneNumberWithError(data.phoneNumbers[i].canonicalForm);
        additionalPhones += {
          number: parsedAdditionalPhone.nationalNumber,
          countryCode: parsedAdditionalPhone.getPossibleCountries()[0],
          callingCode: '+'.concat(parsedAdditionalPhone.countryCallingCode)
        };
      }
    }
    agg.phones = {
      primaryPhoneNumber: parsedPhone.nationalNumber,
      primaryPhoneCountryCode: parsedPhone.getPossibleCountries()[0],
      primaryPhoneCallingCode: '+'.concat(parsedPhone.countryCallingCode),
    }
  }
  agg.googleContactsId = data.resourceName.replace("people/", "");
  agg.name = {
    firstName: data.names[0].displayNameLastFirst.split(",", 2)[1],
    lastName: data.names[0].displayNameLastFirst.split(",", 2)[0]
  }
  agg.emails = {
    primaryEmail: data.emailAddresses ? data.emailAddresses[0].value : '',
    additionalEmails: data.emailAddresses ? data.emailAddresses.map((email) => email.value) : [],
  }
  if (data.urls?.filter((url: { value: string }) => url.value.includes("x.com"))) {
    // @ts-ignore for some reason, IDE takes url type from node, no idea why
    const link: string = data.urls.find((url: { value: string }) => url.value.includes("x.com")) ?? '';
    agg.xLink = {
      primaryLinkLabel: link,
      primaryLinkUrl: link,
    }
  }
  if (data.urls?.filter((url: { value: string }) => url.value.includes("linkedin.com"))) {
    // @ts-ignore for some reason, IDE takes url type from node, no idea why
    const link: string = data.urls.find((url: { value: string }) => url.value.includes("linkedin.com")) ?? '';
    agg.linkedinLink = {
      primaryLinkLabel: link,
      primaryLinkUrl: link,
    }
  }
  agg.jobTitle = data.organizations?.[0].title;
  return agg;
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
      let peopleToCreate = [];
      for (const personChunk of chunk(googleResponse.data.connections, PAGE_SIZE)) {
        for (const person of personChunk) {
          const agg: PersonAgg = { emails: { primaryEmail: '', additionalEmails: [] } };
          peopleToCreate.push(aggPerson(person, agg));
        }
        await client.mutation({
          createPeople: {
            __args: {
              //data: peopleToCreate,
              data: [{
                emails: {
                  primaryEmail: '', additionalEmails: []
                }
              }],
              upsert: true,
            }
          }
        })
      }
      after = googleResponse.data.nextPageToken;
    }
    while (after !== undefined);
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

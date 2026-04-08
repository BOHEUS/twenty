import {
  DatabaseEventPayload,
  defineLogicFunction,
  ObjectRecordUpdateEvent,
} from 'twenty-sdk';
import type { fullEnrichRequest, twentyCompany, twentyPerson } from './shared/types';
import { checkCompanyRequirements } from './shared/check-company-requirements';
import { checkPersonRequirements } from './shared/check-person-requirements';
import { fullEnrichRequirements } from './shared/create-fullenrich-requirements';
import { sendRequestToFullEnrich } from './shared/send-request-to-fullenrich';
import { CoreApiClient } from 'twenty-client-sdk/core';

const FULL_ENRICH_API_KEY: string = process.env.FULL_ENRICH_API_KEY ?? '';
const TWENTY_URL: string = process.env.TWENTY_URL ?? '';

type CompanyUpdateEvent = DatabaseEventPayload<
  ObjectRecordUpdateEvent<twentyCompany>
>;

const findLinkedPerson = async (companyId: string): Promise<twentyPerson[]> => {
  const client = new CoreApiClient();

  const linkedPeople = await client.query({});

  if (!linkedPeople) {
    throw new Error(`Failed to find person related records`);
  }

  return linkedPeople;
};

const handler = async (event: CompanyUpdateEvent): Promise<object | undefined> => {
  if (FULL_ENRICH_API_KEY === '' || TWENTY_URL === '') {
    console.warn('Missing parameters');
    return {};
  }
  const { recordId, properties } = event;
  if (properties.after.domainName.primaryLinkUrl === "" || properties.after.name === "") {
    console.warn("Missing company name or domain link")
    return {};
  }
  if (checkCompanyRequirements(properties.after)) {
    console.log(`Request to FullEnrich not sent as all necessary data are present in ${properties.after.name} record.`)
    return {};
  }
  const linkedPeople: twentyPerson[] = await findLinkedPerson(properties.after.id);
  if (linkedPeople.length === 0) {
    console.warn(`No linked people to company ${properties.after.name}`);
    return {};
  }
  for (const person of linkedPeople) {
    if (
      person.name.firstName === '' ||
      person.name.lastName === '' ||
      person.linkedinLink.primaryLinkUrl === ''
    ) {
      console.log(`Missing data in person record with ID ${person.id}`);
      continue;
    }
    if (checkPersonRequirements(person)) {
      console.log(`Request to FullEnrich not sent as all necessary data are present in ${person.name.firstName} ${person.name.lastName} record.`)
      continue;
    }
    const fullEnrichRequestData: fullEnrichRequest = {
      name: `Twenty contact enrichment - ${person.name.firstName} ${person.name.lastName}`,
      webhook_url: `${TWENTY_URL}/s/webhook/fullenrich`,
      datas: [
        {
          firstname: person.name.firstName,
          lastname: person.name.lastName,
          domain: properties.after.domainName.primaryLinkUrl,
          company_name: properties.after.name,
          linkedin_url: person.linkedinLink.primaryLinkUrl,
          enrich_fields: fullEnrichRequirements(),
          custom: {
            personId: person.id,
            companyId: recordId,
          },
        },
      ],
    };
    const isRequestSent: boolean = await sendRequestToFullEnrich(
      fullEnrichRequestData,
    );
    if (isRequestSent) {
      console.log(
        `Request for ${person.name.firstName} ${person.name.lastName} to FullEnrich sent successfully.`,
      );
    } else {
      console.error(
        `Request for ${person.name.firstName} ${person.name.lastName} to FullEnrich failed.`,
      );
    }
  }

  return undefined;
};

export default defineLogicFunction({
  universalIdentifier: '552084c9-9267-491d-9f17-49b715da86c5',
  name: 'hello-world-logic-function',
  description: 'A simple logic function',
  timeoutSeconds: 5,
  handler,
  databaseEventTriggerSettings: {
    eventName: 'company.updated',
  },
});

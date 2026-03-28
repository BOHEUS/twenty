import { DatabaseEventPayload, defineLogicFunction, ObjectRecordCreateEvent } from 'twenty-sdk';
import type { fullEnrichRequest, twentyCompany, twentyPerson } from './shared/types';
import { checkPersonRequirements } from 'src/logic-functions/shared/check-person-requirements';
import { checkCompanyRequirements } from 'src/logic-functions/shared/check-company-requirements';
import { fullEnrichRequirements } from './shared/create-fullenrich-requirements';
import { sendRequestToFullEnrich } from './shared/send-request-to-fullenrich';
import { CoreApiClient } from 'twenty-sdk/clients';

const FULL_ENRICH_API_KEY: string = process.env.FULL_ENRICH_API_KEY ?? '';
const TWENTY_URL: string = process.env.TWENTY_URL ?? '';

type PersonCreateEvent = DatabaseEventPayload<
  ObjectRecordCreateEvent<twentyPerson>
>;

const fetchTwentyCompany = async (companyId: string) => {
  const client = new CoreApiClient();

  const result = await client.query({});

  if (!result) {
    throw new Error('Failed to fetch related company');
  }

  return result;
}

const handler = async (event: PersonCreateEvent): Promise<object | undefined> => {
  if (FULL_ENRICH_API_KEY === "" || TWENTY_URL === "") {
    console.warn("Missing parameters");
    return {};
  }
  const { recordId, properties } = event;
    if (
      properties.after.companyId === null ||
      properties.after.linkedinLink.primaryLinkUrl === '' ||
      properties.after.name.firstName === '' ||
      properties.after.name.lastName === ''
    ) {
      console.warn('Missing person parameters');
      return {};
    }
    if (checkPersonRequirements(properties.after)) {
      console.log(`Request to FullEnrich not sent as all necessary data are present in ${properties.after.name.firstName} ${properties.after.name.lastName} record.`);
      return {};
    }
    const linkedCompany: twentyCompany = await fetchTwentyCompany(
      properties.after.companyId,
    );
    if (
      linkedCompany.name === '' &&
      linkedCompany.domainName.primaryLinkUrl === ''
    ) {
      console.warn('Missing company parameters');
      return {};
    }
    if (checkCompanyRequirements(linkedCompany)) {
      console.log(`Request to FullEnrich not sent as all necessary data are present in ${linkedCompany.name} record.`);
      return {};
    }
    const fullEnrichRequestData: fullEnrichRequest = {
      name: `Twenty contact enrichment - ${properties.after.name.firstName} ${properties.after.name.lastName}`,
      webhook_url: `${TWENTY_URL}/s/webhook/fullenrich`,
      datas: [
        {
          firstname: properties.after.name.firstName,
          lastname: properties.after.name.lastName,
          domain: linkedCompany.domainName.primaryLinkUrl,
          company_name: linkedCompany.name,
          linkedin_url: properties.after.linkedinLink.primaryLinkUrl,
          enrich_fields: fullEnrichRequirements(),
          custom: {
            personId: recordId,
            companyId: properties.after.companyId,
          },
        },
      ],
    };
    const isRequestSent = await sendRequestToFullEnrich(
      fullEnrichRequestData,
    );
    if (isRequestSent) {
      console.log('Request to FullEnrich sent successfully.');
    } else {
      console.error('Request to FullEnrich failed.');
    }
    return {};
};

export default defineLogicFunction({
  universalIdentifier: '5a4a5605-ef52-4b51-9dc1-bed427a4eb7d',
  name: 'on-person-create',
  description: 'Add a description for your logic function',
  timeoutSeconds: 5,
  handler,
  databaseEventTriggerSettings: {
      eventName: 'person.created',
    },
});

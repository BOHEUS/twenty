import {
  EnrichmentResponse,
  fullEnrichTwentyCompany,
  fullEnrichTwentyPerson,
  twentyPersonSocialMedia,
} from './shared/types';
import { CoreApiClient } from 'twenty-client-sdk/core';
import { HTTPMethod } from 'twenty-shared/types';
import { defineLogicFunction, RoutePayload } from "twenty-sdk/define";
import { buildTwentyPhones } from "src/logic-functions/data/build-twenty-phones.util";
import { buildTwentyEmails } from "src/logic-functions/data/build-twenty-emails.util";
import { buildTwentyCompany } from "src/logic-functions/data/build-twenty-company.util";
import { updatePersonInTwenty } from "src/logic-functions/data/update-person.util";
import { WEBHOOK_FUNCTION_PATH } from "src/constants/universal-identifiers";

const updateCompanyInTwenty = async (
  companyId: string,
  updateData: fullEnrichTwentyCompany,
): Promise<void> => {
  const client = new CoreApiClient();

  const result = await client.mutation({
    updateCompany: {
      __args: {
        id: companyId,
        data: updateData,
      },
      id: true,
    },
  });

  if (!result.updateCompany) {
    throw new Error(`Failed to update company ${companyId}: no result`);
  }
};

const handler = async (event: RoutePayload<EnrichmentResponse>): Promise<object | undefined> => {
  const { body } = event;
  const client = new CoreApiClient();
  if (!body) {
    throw new Error('Error parsing webhook data from FullEnrich');
  }
  for (const record of body.data) {
    const { custom, contact_info: contactInfo, profile } = record;

    if (!custom?.personId) {
      console.warn('Skipping FullEnrich record without a Twenty person id.');
      continue;
    }

    const twentyCompanyData = profile ? buildTwentyCompany(profile) : null;
    if (twentyCompanyData) {
      await updateCompanyInTwenty(custom.companyId, twentyCompanyData);
      console.log(
        `Successfully updated ${twentyCompanyData.name} company in Twenty.`,
      );
    } else {
      console.warn(`No company data returned for person ${custom.personId}.`);
    }

    const professionalNetworkUrl =
      profile?.social_profiles?.professional_network?.url;
    const linkedinLink: twentyPersonSocialMedia | undefined =
      professionalNetworkUrl
        ? { primaryLinkLabel: '', primaryLinkUrl: professionalNetworkUrl }
        : undefined;

    const twentyPersonData: fullEnrichTwentyPerson = {
      companyId: custom.companyId,
      ...(contactInfo && {
        emails: buildTwentyEmails(contactInfo),
        phones: buildTwentyPhones(contactInfo),
      }),
      ...(profile && {
        name: { firstName: profile.first_name, lastName: profile.last_name },
        jobTitle: profile.employment?.current?.title ?? '',
        city: profile.location?.city ?? '',
        intro: profile.description ?? '',
      }),
      ...(linkedinLink && { linkedinLink }),
    };
    await updatePersonInTwenty(custom.personId, twentyPersonData, client);
    console.log(`Person ${custom.personId} has been updated successfully.`);
  }

  return {};
};

export default defineLogicFunction({
  universalIdentifier: '8672b95c-949c-421a-9aa8-085ddea5bb2f',
  name: 'on-webhook',
  description: 'Updates records based on webhook data',
  timeoutSeconds: 900,
  handler,
  httpRouteTriggerSettings: {
    path: WEBHOOK_FUNCTION_PATH,
    httpMethod: HTTPMethod.POST,
    isAuthRequired: false,
  },
});

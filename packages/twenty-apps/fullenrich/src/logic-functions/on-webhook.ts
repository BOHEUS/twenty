import {
  ContactInfo,
  EnrichmentResponse,
  Profile,
  twentyCompany,
  twentyPerson,
  twentyPersonPhones,
  twentyPersonSocialMedia,
} from './shared/types';
import { CoreApiClient } from 'twenty-client-sdk/core';
import { HTTPMethod } from 'twenty-shared/types';
import { defineLogicFunction, RoutePayload } from "twenty-sdk/define";

type fullEnrichTwentyCompany = Omit<twentyCompany, "id">;
type fullEnrichTwentyPerson = Omit<twentyPerson, "id">;

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

const updatePersonInTwenty = async (
  personId: string,
  updateData: fullEnrichTwentyPerson,
): Promise<void> => {
  const client = new CoreApiClient();

  const result = await client.mutation({
    updatePerson: {
      __args: {
        id: personId,
        data: updateData,
      },
      id: true,
    },
  });

  if (!result.updateCompany) {
    throw new Error(`Failed to update person ${personId}: no result`);
  }
};

const buildTwentyCompany = (profile: Profile): fullEnrichTwentyCompany | null => {
  const company = profile.employment?.current?.company;
  if (!company) {
    return null;
  }
  const headquarters = company.locations?.headquarters;
  return {
    name: company.name,
    domainName: {
      primaryLinkUrl: company.website ?? '',
      primaryLinkLabel: '',
    },
    employees: company.headcount ?? null,
    linkedinLink: {
      primaryLinkLabel: '',
      primaryLinkUrl: company.social_profiles?.professional_network?.url ?? '',
    },
    address: {
      addressStreet1: headquarters?.line1 ?? '',
      addressStreet2: headquarters?.line2 ?? '',
      addressCity: headquarters?.city ?? '',
      addressCountry: headquarters?.country ?? '',
      // FullEnrich's v2 API does not return a separate postal code for headquarters.
      addressPostCode: '',
      addressState: headquarters?.region ?? '',
    },
  };
};

const buildTwentyEmails = (contactInfo: ContactInfo) => {
  const primaryEmail =
    contactInfo.most_probable_work_email?.email ??
    contactInfo.most_probable_personal_email?.email ??
    '';
  const deliverableEmails = [
    ...(contactInfo.work_emails ?? []),
    ...(contactInfo.personal_emails ?? []),
  ]
    .filter((email) => ['DELIVERABLE', 'HIGH_PROBABILITY'].includes(email.status))
    .map((email) => email.email)
    .filter((email) => email !== primaryEmail);
  return {
    primaryEmail,
    additionalEmails: deliverableEmails.length > 0 ? deliverableEmails : null,
  };
};

const buildTwentyPhones = (contactInfo: ContactInfo): twentyPersonPhones => {
  const mostProbablePhone = contactInfo.most_probable_phone;
  if (!mostProbablePhone) {
    return {
      primaryPhoneNumber: '',
      primaryPhoneCallingCode: '',
      additionalPhones: null,
    };
  }
  const [primaryPhoneCallingCode, primaryPhoneNumber] =
    mostProbablePhone.number.split(' ', 2);
  const phones = contactInfo.phones ?? [];
  return {
    primaryPhoneNumber: primaryPhoneNumber ?? '',
    primaryPhoneCallingCode: primaryPhoneCallingCode ?? '',
    additionalPhones:
      phones.length > 1 ? phones.map((phone) => phone.number) : null,
  };
};

const handler = async (event: RoutePayload): Promise<object | undefined> => {
  const { body } = event;
  if (!body) {
    throw new Error('Error parsing webhook data from FullEnrich');
  }
  const enrichmentResponse = body as EnrichmentResponse;
  const contactData = enrichmentResponse.data[0];
  const { custom, contact_info: contactInfo, profile } = contactData;

  const twentyCompanyData = buildTwentyCompany(profile);
  if (twentyCompanyData) {
    await updateCompanyInTwenty(custom.companyId, twentyCompanyData);
    console.log(
      `Successfully updated ${twentyCompanyData.name} company in Twenty.`,
    );
  } else {
    console.warn(`No company data returned for person ${custom.personId}.`);
  }

  const linkedinLink: twentyPersonSocialMedia = {
    primaryLinkLabel: '',
    primaryLinkUrl:
      profile.social_profiles?.professional_network?.url ??
      profile.social_profiles?.linkedin?.url ??
      '',
  };

  const twentyPersonData: fullEnrichTwentyPerson = {
    name: { firstName: profile.first_name, lastName: profile.last_name },
    emails: buildTwentyEmails(contactInfo),
    linkedinLink,
    xLink: { primaryLinkLabel: '', primaryLinkUrl: '' },
    jobTitle: profile.employment?.current?.title ?? '',
    phones: buildTwentyPhones(contactInfo),
    city: profile.location?.city ?? '',
    intro: profile.description ?? '',
    companyId: custom.companyId,
  };
  await updatePersonInTwenty(custom.personId, twentyPersonData);
  console.log(
    `Person ${profile.first_name} ${profile.last_name} has been updated successfully.`,
  );

  return {};
};

export default defineLogicFunction({
  universalIdentifier: '8672b95c-949c-421a-9aa8-085ddea5bb2f',
  name: 'on-webhook',
  description: 'Updates records based on webhook data',
  timeoutSeconds: 5,
  handler,
  httpRouteTriggerSettings: {
    path: '/on-webhook',
    httpMethod: HTTPMethod.POST,
    isAuthRequired: false,
  },
});

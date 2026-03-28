import {
  fullEnrichPerson,
  fullEnrichWebhookResponse,
  twentyCompany,
  twentyPerson,
  twentyPersonPhones,
  twentyPersonSocialMedia,
} from './shared/types';
import { defineLogicFunction } from 'twenty-sdk';
import { CoreApiClient } from 'twenty-sdk/clients';
import { HTTPMethod } from 'twenty-shared/types';

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

const handler = async (data: fullEnrichWebhookResponse): Promise<object | undefined> => {
  const properties = data.datas[0];
  const input: fullEnrichPerson = {
    firstname: properties.firstname,
    lastname: properties.lastname,
    most_probable_email: properties.most_probable_email,
    most_probable_email_status: properties.most_probable_email_status,
    most_probable_phone: properties.most_probable_phone,
    emails: properties.emails,
    phones: properties.phones,
    social_medias: properties.social_medias,
    profile: properties.profile,
  };
  const twentyCompany: fullEnrichTwentyCompany = {
    name: input.profile.position.company.name,
    domainName: {
      primaryLinkUrl: input.profile.position.company.website,
      primaryLinkLabel: '',
    },
    employees: input.profile.position.company.headcount,
    linkedinLink: {
      primaryLinkLabel: '',
      primaryLinkUrl: input.profile.position.company.linkedin_url,
    },
    address: {
      addressStreet1:
        input.profile.position.company.headquarters.address_line_1,
      addressStreet2:
        input.profile.position.company.headquarters.address_line_2,
      addressCity: input.profile.position.company.headquarters.city,
      addressCountry: input.profile.position.company.headquarters.country,
      addressPostCode: input.profile.position.company.headquarters.postalCode,
      addressState: input.profile.position.company.headquarters.region,
    },
  };
  await updateCompanyInTwenty(
    properties.custom.companyId,
    twentyCompany,
  );
    console.log(
      `Successfully updated ${twentyCompany.name} company in Twenty.`,
    );
  const mails: string[] | null = input.emails.find((email) =>
    ['DELIVERABLE', 'HIGH_PROBABILITY'].includes(email.status),
  )
    ? input.emails
        .map((email) =>
          ['DELIVERABLE', 'HIGH_PROBABILITY'].includes(email.status)
            ? email.email
            : '',
        )
        .filter((email) => email.length > 0)
    : null;
  const linkedinLink: twentyPersonSocialMedia = input.social_medias.find(
    (media) => media.type === 'LINKEDIN',
  )
    ? {
        primaryLinkLabel: '',
        primaryLinkUrl: input.social_medias.find(
          (media) => media.type === 'LINKEDIN',
        )?.url ?? '',
      }
    : { primaryLinkLabel: '', primaryLinkUrl: '' };
  const xLink: twentyPersonSocialMedia = input.social_medias.find(
    (media) => media.type === 'TWITTER',
  )
    ? {
        primaryLinkLabel: '',
        primaryLinkUrl: input.social_medias.find(
          (media) => media.type === 'TWITTER',
        )?.url ?? '',
      }
    : { primaryLinkLabel: '', primaryLinkUrl: '' };
  const phones: twentyPersonPhones =
    input.most_probable_phone === undefined || input.most_probable_phone === ''
      ? {
          primaryPhoneNumber: '',
          primaryPhoneCallingCode: '',
          additionalPhones: null,
        }
      : input.phones.length === 1
      ? {
          primaryPhoneNumber: input.most_probable_phone.split(' ', 2)[0],
          primaryPhoneCallingCode: input.most_probable_phone.split(' ', 2)[1],
          additionalPhones: null,
        }
      : {
          primaryPhoneNumber: input.most_probable_phone.split(' ', 2)[0],
          primaryPhoneCallingCode: input.most_probable_phone.split(' ', 2)[1],
          additionalPhones: input.phones.map((phone) => phone.number),
        };
  const twentyPersonData: fullEnrichTwentyPerson = {
    name: { firstName: input.firstname, lastName: input.lastname },
    emails: {
      primaryEmail: input.most_probable_email,
      additionalEmails: mails,
    },
    linkedinLink: linkedinLink,
    xLink: xLink,
    jobTitle: input.profile.position.title,
    phones: phones,
    city: input.profile.location,
    intro: input.profile.summary,
    companyId: properties.custom.companyId,
  };
  await updatePersonInTwenty(
    properties.custom.personId,
    twentyPersonData,
  );
    console.log(
      `Person ${input.firstname} ${input.lastname} has been updated successfully.`,
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

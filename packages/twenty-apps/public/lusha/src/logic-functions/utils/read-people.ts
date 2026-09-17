import { type CoreApiClient } from 'twenty-client-sdk/core';
import { isDefined } from 'twenty-sdk/utils';

import { type PersonRecord } from 'src/logic-functions/types/person-record.type';

export const readPeople = async ({
  client,
  recordIds,
}: {
  client: CoreApiClient;
  recordIds: string[];
}): Promise<PersonRecord[]> => {
  if (recordIds.length === 0) {
    return [];
  }

  const result = (await client.query({
    people: {
      __args: { filter: { id: { in: recordIds } }, first: recordIds.length },
      edges: {
        node: {
          id: true,
          name: { firstName: true, lastName: true },
          emails: { primaryEmail: true, additionalEmails: true },
          phones: {
            primaryPhoneNumber: true,
            primaryPhoneCountryCode: true,
            primaryPhoneCallingCode: true,
            additionalPhones: {
              number: true,
              countryCode: true,
              callingCode: true,
            },
          },
          jobTitle: true,
          linkedinLink: {
            primaryLinkUrl: true,
            primaryLinkLabel: true,
            secondaryLinks: { url: true, label: true },
          },
          company: {
            id: true,
            name: true,
            domainName: { primaryLinkUrl: true },
          },
          lushaId: true,
        },
      },
    },
  })) as { people?: { edges?: { node?: PersonRecord }[] } };

  return (result.people?.edges ?? [])
    .map((edge) => edge?.node)
    .filter((person): person is PersonRecord => isDefined(person?.id));
};

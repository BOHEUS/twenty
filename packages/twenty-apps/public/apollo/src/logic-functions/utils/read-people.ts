import { type CoreApiClient } from 'twenty-client-sdk/core';

import { type PersonRecord } from 'src/logic-functions/types/person-record.type';
import { isDefined } from '../data/is-defined';

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
          emails: { primaryEmail: true },
          linkedinLink: { primaryLinkUrl: true },
          company: { domainName: { primaryLinkUrl: true } },
        },
      },
    },
  })) as { people?: { edges?: { node?: PersonRecord }[] } };

  return (result.people?.edges ?? [])
    .map((edge) => edge?.node)
    .filter((person): person is PersonRecord => isDefined(person?.id));
};

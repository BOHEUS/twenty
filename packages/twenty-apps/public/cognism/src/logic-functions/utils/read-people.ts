import { type CoreApiClient } from 'twenty-client-sdk/core';

import { extractConnectionNodes } from 'src/logic-functions/utils/extract-connection-nodes';
import { type PersonNode } from 'src/logic-functions/types/person-node';

export const readPeople = async ({
  client,
  recordIds,
}: {
  client: CoreApiClient;
  recordIds: string[];
}): Promise<PersonNode[]> => {
  if (recordIds.length === 0) {
    return [];
  }

  const result = await client.query({
    people: {
      __args: { filter: { id: { in: recordIds } }, first: recordIds.length },
      edges: {
        node: {
          id: true,
          name: { firstName: true, lastName: true },
          emails: { primaryEmail: true },
          phones: { primaryPhoneNumber: true },
          jobTitle: true,
          linkedinLink: { primaryLinkUrl: true },
          company: {
            id: true,
            name: true,
            domainName: { primaryLinkUrl: true },
          },
          cognismId: true,
          cognismLastEnrichedAt: true,
        },
      },
    },
  });

  return extractConnectionNodes<PersonNode>(result.people);
};

import { type CoreApiClient } from 'twenty-client-sdk/core';
import { isDefined } from 'twenty-sdk/utils';

import { type CompanyRecord } from 'src/logic-functions/types/company-record.type';

export const readCompanies = async ({
  client,
  recordIds,
}: {
  client: CoreApiClient;
  recordIds: string[];
}): Promise<CompanyRecord[]> => {
  if (recordIds.length === 0) {
    return [];
  }

  const result = (await client.query({
    companies: {
      __args: { filter: { id: { in: recordIds } }, first: recordIds.length },
      edges: {
        node: {
          id: true,
          name: true,
          domainName: {
            primaryLinkUrl: true,
            primaryLinkLabel: true,
            secondaryLinks: { url: true, label: true },
          },
          linkedinLink: {
            primaryLinkUrl: true,
            primaryLinkLabel: true,
            secondaryLinks: { url: true, label: true },
          },
          address: {
            addressStreet1: true,
            addressStreet2: true,
            addressCity: true,
            addressState: true,
            addressPostcode: true,
            addressCountry: true,
          },
          lushaId: true,
        },
      },
    },
  })) as { companies?: { edges?: { node?: CompanyRecord }[] } };

  return (result.companies?.edges ?? [])
    .map((edge) => edge?.node)
    .filter((company): company is CompanyRecord => isDefined(company?.id));
};

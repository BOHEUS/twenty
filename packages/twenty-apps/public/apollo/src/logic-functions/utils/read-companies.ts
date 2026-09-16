import { type CoreApiClient } from 'twenty-client-sdk/core';

import { type CompanyRecord } from 'src/logic-functions/types/company-record.type';
import { isDefined } from '../data/is-defined';

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
          domainName: { primaryLinkUrl: true },
        },
      },
    },
  })) as { companies?: { edges?: { node?: CompanyRecord }[] } };

  return (result.companies?.edges ?? [])
    .map((edge) => edge?.node)
    .filter((company): company is CompanyRecord => isDefined(company?.id));
};

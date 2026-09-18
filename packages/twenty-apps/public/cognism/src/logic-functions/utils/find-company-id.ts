import { isNonEmptyString } from '@sniptt/guards';
import { type CoreApiClient } from 'twenty-client-sdk/core';

import { findCompanyIdByFilter } from 'src/logic-functions/utils/find-company-id-by-filter';
import { type CompanyMatchKeys } from 'src/logic-functions/types/company-match-keys';
import { isDefined } from 'src/logic-functions/data/is-defined';

const COMPANY_LOOKUPS: {
  matchKey: keyof CompanyMatchKeys;
  buildFilter: (matchValue: string) => Record<string, unknown>;
  requireUnique?: boolean;
}[] = [
  {
    matchKey: 'cognismId',
    buildFilter: (cognismId) => ({ cognismId: { eq: cognismId } }),
  },
  {
    matchKey: 'website',
    buildFilter: (website) => ({
      domainName: { primaryLinkUrl: { eq: website } },
    }),
  },
  {
    matchKey: 'linkedinUrl',
    buildFilter: (linkedinUrl) => ({
      linkedinLink: { primaryLinkUrl: { eq: linkedinUrl } },
    }),
  },
  // A name can match several companies, so it only counts when unambiguous.
  {
    matchKey: 'name',
    buildFilter: (name) => ({ name: { eq: name } }),
    requireUnique: true,
  },
];

export const findCompanyId = async ({
  client,
  matchKeys,
}: {
  client: CoreApiClient;
  matchKeys: CompanyMatchKeys;
}): Promise<string | undefined> => {
  for (const { matchKey, buildFilter, requireUnique } of COMPANY_LOOKUPS) {
    const matchValue = matchKeys[matchKey];
    if (!isNonEmptyString(matchValue)) {
      continue;
    }

    const companyId = await findCompanyIdByFilter({
      client,
      filter: buildFilter(matchValue),
      requireUnique,
    });
    if (isDefined(companyId)) {
      return companyId;
    }
  }

  return undefined;
};

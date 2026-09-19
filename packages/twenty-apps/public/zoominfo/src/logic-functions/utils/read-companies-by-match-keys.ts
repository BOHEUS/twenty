import { isNonEmptyArray, isNonEmptyString } from '@sniptt/guards';
import { type CoreApiClient } from 'twenty-client-sdk/core';

import { type CompanyLookupNode } from 'src/types/company-lookup-node';
import { type CompanyMatchKeys } from 'src/types/company-match-keys';
import { isRecord } from 'src/utils/is-record';

const collectDistinct = (
  matchKeysList: CompanyMatchKeys[],
  key: keyof CompanyMatchKeys,
): string[] => [
  ...new Set(
    matchKeysList
      .map((matchKeys) => matchKeys[key])
      .filter((value): value is string => isNonEmptyString(value)),
  ),
];

export const readCompaniesByMatchKeys = async ({
  client,
  matchKeysList,
}: {
  client: CoreApiClient;
  matchKeysList: CompanyMatchKeys[];
}): Promise<CompanyLookupNode[]> => {
  const zoomInfoCompanyIds = collectDistinct(matchKeysList, 'zoomInfoCompanyId');
  const websites = collectDistinct(matchKeysList, 'website');
  const linkedinUrls = collectDistinct(matchKeysList, 'linkedinUrl');
  const names = collectDistinct(matchKeysList, 'name');

  const filters = [
    isNonEmptyArray(zoomInfoCompanyIds)
      ? { zoomInfoCompanyId: { in: zoomInfoCompanyIds } }
      : undefined,
    isNonEmptyArray(websites)
      ? { domainName: { primaryLinkUrl: { in: websites } } }
      : undefined,
    isNonEmptyArray(linkedinUrls)
      ? { linkedinLink: { primaryLinkUrl: { in: linkedinUrls } } }
      : undefined,
    isNonEmptyArray(names) ? { name: { in: names } } : undefined,
  ].filter((filter) => filter !== undefined);

  if (!isNonEmptyArray(filters)) {
    return [];
  }

  // One extra row per name tells buildCompanyLookupIndex that a name is
  // ambiguous, matching the uniqueness check the per-record lookup does.
  const pageSize =
    zoomInfoCompanyIds.length +
    websites.length +
    linkedinUrls.length +
    names.length * 2;

  const result = (await client.query({
    companies: {
      __args: { filter: { or: filters }, first: pageSize },
      edges: {
        node: {
          id: true,
          name: true,
          domainName: { primaryLinkUrl: true },
          linkedinLink: { primaryLinkUrl: true },
          zoomInfoCompanyId: true,
        },
      },
    },
  })) as { companies?: { edges?: { node: CompanyLookupNode }[] } };

  const edges = result.companies?.edges;
  if (!Array.isArray(edges)) {
    return [];
  }

  return edges
    .map((edge) => edge?.node)
    .filter(
      (companyNode): companyNode is CompanyLookupNode =>
        isRecord(companyNode) && isNonEmptyString(companyNode.id),
    );
};

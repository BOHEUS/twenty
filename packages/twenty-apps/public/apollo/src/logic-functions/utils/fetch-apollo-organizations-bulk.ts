import { type ApolloApiResult } from 'src/logic-functions/types/apollo-api-result.type';
import { type ApolloRecord } from 'src/logic-functions/types/apollo-record.type';
import { callApolloApi } from 'src/logic-functions/utils/call-apollo-api';
import { isDefined } from '../data/is-defined';
import { normalizeDomain } from '../data/normalize-domain';
import { toJsonObject } from '../data/to-json';

const ORGANIZATION_DOMAIN_KEYS = ['primary_domain', 'website_url', 'domain'];

const buildOrganizationByDomain = (
  organizations: (ApolloRecord | undefined)[],
): Map<string, ApolloRecord> => {
  const organizationByDomain = new Map<string, ApolloRecord>();

  for (const organization of organizations) {
    if (!isDefined(organization)) {
      continue;
    }

    for (const key of ORGANIZATION_DOMAIN_KEYS) {
      const domain = normalizeDomain(organization[key]);

      if (isDefined(domain) && !organizationByDomain.has(domain)) {
        organizationByDomain.set(domain, organization);
      }
    }
  }

  return organizationByDomain;
};

export const fetchApolloOrganizationsBulk = async ({
  domains,
  accessToken,
}: {
  domains: string[];
  accessToken: string;
}): Promise<ApolloApiResult<(ApolloRecord | undefined)[]>> => {
  const result = await callApolloApi({
    path: '/organizations/bulk_enrich',
    method: 'POST',
    accessToken,
    query: { 'domains[]': domains },
  });

  if (!result.success) {
    return result;
  }

  const organizations = (
    Array.isArray(result.data.organizations) ? result.data.organizations : []
  ).map(toJsonObject);

  const organizationByDomain = buildOrganizationByDomain(organizations);
  const matchedByDomain = domains.map((domain) =>
    organizationByDomain.get(domain),
  );

  const isAnswerComplete = organizations.length === domains.length;
  const claimedOrganizations = new Set(matchedByDomain.filter(isDefined));

  return {
    success: true,
    data: matchedByDomain.map((organization, index) => {
      if (isDefined(organization) || !isAnswerComplete) {
        return organization;
      }

      const organizationAtPosition = organizations[index];

      return isDefined(organizationAtPosition) &&
        !claimedOrganizations.has(organizationAtPosition)
        ? organizationAtPosition
        : undefined;
    }),
  };
};

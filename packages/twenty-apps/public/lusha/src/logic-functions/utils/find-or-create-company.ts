import { type CoreApiClient } from 'twenty-client-sdk/core';
import { isDefined } from 'twenty-sdk/utils';

import { buildLinks } from 'src/logic-functions/data/build-links';
import { normalizeDomain } from 'src/logic-functions/data/normalize-domain';
import { pruneUndefined } from 'src/logic-functions/data/prune-undefined';
import { toJsonObject } from 'src/logic-functions/data/to-json';
import { toText } from 'src/logic-functions/data/to-text';
import { type LushaRecord } from 'src/logic-functions/types/lusha-record.type';

const findCompanyIdByDomain = async ({
  client,
  domain,
}: {
  client: CoreApiClient;
  domain: string;
}): Promise<string | undefined> => {
  const result = (await client.query({
    companies: {
      __args: {
        filter: { domainName: { primaryLinkUrl: { eq: domain } } },
        first: 1,
      },
      edges: { node: { id: true } },
    },
  })) as { companies?: { edges?: { node?: { id?: string } }[] } };

  return result.companies?.edges?.[0]?.node?.id;
};

const createCompany = async ({
  client,
  domain,
  lushaCompany,
}: {
  client: CoreApiClient;
  domain: string;
  lushaCompany: LushaRecord;
}): Promise<string | undefined> => {
  const result = (await client.mutation({
    createCompany: {
      __args: {
        data: pruneUndefined({
          name: toText(lushaCompany.name) ?? domain,
          domainName: buildLinks(domain),
          lushaId: toText(lushaCompany.id),
          lushaIndustry: toText(lushaCompany.industry),
        }),
      },
      id: true,
    },
  })) as { createCompany?: { id?: string } };

  return result.createCompany?.id;
};

// People are enriched concurrently, so the cache holds the pending lookup to
// create each new company only once.
export const findOrCreateCompany = async ({
  client,
  contact,
  companyIdByDomain,
}: {
  client: CoreApiClient;
  contact: LushaRecord;
  companyIdByDomain: Map<string, Promise<string | undefined>>;
}): Promise<string | undefined> => {
  const lushaCompany = toJsonObject(contact.company);
  const domain = normalizeDomain(lushaCompany?.domain);

  if (!isDefined(lushaCompany) || !isDefined(domain)) {
    return undefined;
  }

  const cachedCompanyId = companyIdByDomain.get(domain);

  if (isDefined(cachedCompanyId)) {
    return cachedCompanyId;
  }

  const companyId = findCompanyIdByDomain({ client, domain }).then(
    (existingCompanyId) =>
      existingCompanyId ?? createCompany({ client, domain, lushaCompany }),
  );

  companyIdByDomain.set(domain, companyId);

  return companyId;
};

import { CoreApiClient } from 'twenty-client-sdk/core';

import { type EnrichmentResult } from 'src/logic-functions/types/enrichment-result.type';
import { fetchApolloOrganization } from 'src/logic-functions/utils/fetch-apollo-organization';
import { getApolloApiKey } from 'src/logic-functions/utils/get-apollo-api-key';
import {
  buildCompanyApolloData,
  buildCompanyStandardData,
} from 'src/logic-functions/utils/map-organization';
import { isDefined } from 'src/data/is-defined';
import { normalizeDomain } from 'src/data/normalize-domain';

type CompanyRecord = {
  id: string;
  domainName?: { primaryLinkUrl?: string | null } | null;
};

const updateCompany = async ({
  client,
  recordId,
  data,
}: {
  client: CoreApiClient;
  recordId: string;
  data: Record<string, unknown>;
}): Promise<void> => {
  await client.mutation({
    updateCompany: { __args: { id: recordId, data }, id: true },
  });
};

export const enrichCompanyHandler = async ({
  recordId,
}: {
  recordId: string;
}): Promise<EnrichmentResult> => {
  const apiKey = getApolloApiKey();

  if (!isDefined(apiKey)) {
    return {
      success: false,
      recordId,
      status: 'ERROR',
      updatedFields: [],
      message:
        'APOLLO_API_KEY is not set. An admin must configure the Apollo API key on this application.',
    };
  }

  const client = new CoreApiClient();

  const companyResult = await client.query({
    company: {
      __args: { filter: { id: { eq: recordId } } },
      id: true,
      domainName: { primaryLinkUrl: true },
    },
  });

  const company = companyResult?.company as CompanyRecord | null | undefined;

  if (!isDefined(company)) {
    return {
      success: false,
      recordId,
      status: 'ERROR',
      updatedFields: [],
      message: `Company ${recordId} was not found.`,
    };
  }

  const domain = normalizeDomain(company.domainName?.primaryLinkUrl);

  if (!isDefined(domain)) {
    return {
      success: false,
      recordId,
      status: 'SKIPPED',
      updatedFields: [],
      message: 'Company has no domain, which Apollo needs to match it.',
    };
  }

  const enrichedAt = new Date().toISOString();
  const organizationResult = await fetchApolloOrganization({ domain, apiKey });

  if (!organizationResult.success) {
    await updateCompany({
      client,
      recordId,
      data: {
        apolloLastEnrichedAt: enrichedAt,
        apolloEnrichmentStatus: 'ERROR',
      },
    });

    return {
      success: false,
      recordId,
      status: 'ERROR',
      updatedFields: [],
      message: organizationResult.error,
    };
  }

  const organization = organizationResult.data;

  if (!isDefined(organization)) {
    await updateCompany({
      client,
      recordId,
      data: {
        apolloLastEnrichedAt: enrichedAt,
        apolloEnrichmentStatus: 'NOT_FOUND',
      },
    });

    return {
      success: false,
      recordId,
      status: 'NOT_FOUND',
      updatedFields: [],
      message: `Apollo returned no organization for ${domain}.`,
    };
  }

  const data = {
    ...buildCompanyStandardData(organization),
    ...buildCompanyApolloData({ organization, enrichedAt }),
  };

  await updateCompany({ client, recordId, data });

  return {
    success: true,
    recordId,
    status: 'ENRICHED',
    updatedFields: Object.keys(data),
    message: `Enriched company from Apollo for ${domain}.`,
  };
};

import { CoreApiClient } from 'twenty-client-sdk/core';
import {
  reportConnectionAuthFailure,
  type LogicFunctionExecutionContext,
} from 'twenty-sdk/logic-function';

import {
  APOLLO_COMPANY_NO_IDENTIFIER_MESSAGE,
  APOLLO_NOT_CONNECTED_MESSAGE,
} from 'src/constants/enrichment-messages.constant';
import { type CompanyRecord } from 'src/logic-functions/types/company-record.type';
import { type EnrichmentResult } from 'src/logic-functions/types/enrichment-result.type';
import { fetchApolloOrganization } from 'src/logic-functions/utils/fetch-apollo-organization';
import { findApolloConnection } from 'src/logic-functions/utils/find-apollo-connection';
import {
  buildCompanyApolloData,
  buildCompanyStandardData,
} from 'src/logic-functions/utils/map-organization';
import { updateCompanyRecord } from 'src/logic-functions/utils/update-company-record';
import { isDefined } from 'src/logic-functions/data/is-defined';
import { normalizeDomain } from 'src/logic-functions/data/normalize-domain';

export const enrichCompanyHandler = async ({
  recordId,
  context,
}: {
  recordId: string;
  context: Pick<LogicFunctionExecutionContext, 'userWorkspaceId'>;
}): Promise<EnrichmentResult> => {
  const connection = await findApolloConnection(context);

  if (!isDefined(connection)) {
    return {
      success: false,
      recordId,
      status: 'ERROR',
      updatedFields: [],
      message: APOLLO_NOT_CONNECTED_MESSAGE,
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
      message: APOLLO_COMPANY_NO_IDENTIFIER_MESSAGE,
    };
  }

  const enrichedAt = new Date().toISOString();
  const organizationResult = await fetchApolloOrganization({
    domain,
    accessToken: connection.accessToken,
  });

  if (!organizationResult.success) {
    if (organizationResult.isAuthFailure) {
      await reportConnectionAuthFailure({
        connectionId: connection.id,
        reason: 'Apollo rejected the access token.',
      }).catch(() => undefined);
    }

    await updateCompanyRecord({
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
    await updateCompanyRecord({
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

  await updateCompanyRecord({ client, recordId, data });

  return {
    success: true,
    recordId,
    status: 'ENRICHED',
    updatedFields: Object.keys(data),
    message: `Enriched company from Apollo for ${domain}.`,
  };
};

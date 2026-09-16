import { CoreApiClient } from 'twenty-client-sdk/core';
import {
  reportConnectionAuthFailure,
  type LogicFunctionExecutionContext,
} from 'twenty-sdk/logic-function';

import {
  APOLLO_NOT_CONNECTED_MESSAGE,
  APOLLO_PERSON_NO_IDENTIFIER_MESSAGE,
} from 'src/constants/enrichment-messages.constant';
import { type EnrichmentResult } from 'src/logic-functions/types/enrichment-result.type';
import { type PersonRecord } from 'src/logic-functions/types/person-record.type';
import { buildPersonMatchParams } from 'src/logic-functions/utils/build-person-match-params';
import { fetchApolloPerson } from 'src/logic-functions/utils/fetch-apollo-person';
import { findApolloConnection } from 'src/logic-functions/utils/find-apollo-connection';
import {
  buildPersonApolloData,
  buildPersonStandardData,
} from 'src/logic-functions/utils/map-person';
import { updatePersonRecord } from 'src/logic-functions/utils/update-person-record';
import { isDefined } from 'src/logic-functions/data/is-defined';

export const enrichPersonHandler = async ({
  recordId,
  revealPersonalEmails = false,
  context,
}: {
  recordId: string;
  revealPersonalEmails?: boolean;
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

  const personResult = await client.query({
    person: {
      __args: { filter: { id: { eq: recordId } } },
      id: true,
      name: { firstName: true, lastName: true },
      emails: { primaryEmail: true },
      linkedinLink: { primaryLinkUrl: true },
      company: { domainName: { primaryLinkUrl: true } },
    },
  });

  const person = personResult?.person as PersonRecord | null | undefined;

  if (!isDefined(person)) {
    return {
      success: false,
      recordId,
      status: 'ERROR',
      updatedFields: [],
      message: `Person ${recordId} was not found.`,
    };
  }

  const params = buildPersonMatchParams(person);

  if (!isDefined(params)) {
    return {
      success: false,
      recordId,
      status: 'SKIPPED',
      updatedFields: [],
      message: APOLLO_PERSON_NO_IDENTIFIER_MESSAGE,
    };
  }

  const enrichedAt = new Date().toISOString();
  const matchResult = await fetchApolloPerson({
    params,
    accessToken: connection.accessToken,
    revealPersonalEmails,
  });

  if (!matchResult.success) {
    if (matchResult.isAuthFailure) {
      await reportConnectionAuthFailure({
        connectionId: connection.id,
        reason: 'Apollo rejected the access token.',
      }).catch(() => undefined);
    }

    await updatePersonRecord({
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
      message: matchResult.error,
    };
  }

  const matchedPerson = matchResult.data;

  if (!isDefined(matchedPerson)) {
    await updatePersonRecord({
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
      message: 'Apollo returned no person for this record.',
    };
  }

  const data = {
    ...buildPersonStandardData(matchedPerson),
    ...buildPersonApolloData({ person: matchedPerson, enrichedAt }),
  };

  await updatePersonRecord({ client, recordId, data });

  return {
    success: true,
    recordId,
    status: 'ENRICHED',
    updatedFields: Object.keys(data),
    message: 'Enriched person from Apollo.',
  };
};

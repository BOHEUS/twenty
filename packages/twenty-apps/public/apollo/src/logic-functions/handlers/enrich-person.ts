import { CoreApiClient } from 'twenty-client-sdk/core';

import { type EnrichmentResult } from 'src/logic-functions/types/enrichment-result.type';
import {
  fetchApolloPerson,
  type ApolloPersonMatchParams,
} from 'src/logic-functions/utils/fetch-apollo-person';
import { getApolloApiKey } from 'src/logic-functions/utils/get-apollo-api-key';
import {
  buildPersonApolloData,
  buildPersonStandardData,
} from 'src/logic-functions/utils/map-person';
import { isDefined } from 'src/data/is-defined';
import { normalizeDomain } from 'src/data/normalize-domain';
import { pruneUndefined } from 'src/data/prune-undefined';
import { toText } from 'src/data/to-text';

type PersonRecord = {
  id: string;
  name?: { firstName?: string | null; lastName?: string | null } | null;
  emails?: { primaryEmail?: string | null } | null;
  linkedinLink?: { primaryLinkUrl?: string | null } | null;
  company?: { domainName?: { primaryLinkUrl?: string | null } | null } | null;
};

const buildMatchParams = (
  person: PersonRecord,
): ApolloPersonMatchParams | undefined => {
  const params = pruneUndefined({
    email: toText(person.emails?.primaryEmail),
    firstName: toText(person.name?.firstName),
    lastName: toText(person.name?.lastName),
    linkedinUrl: toText(person.linkedinLink?.primaryLinkUrl),
    domain: normalizeDomain(person.company?.domainName?.primaryLinkUrl),
  }) as ApolloPersonMatchParams;

  // Apollo needs an email, a LinkedIn profile, or a name paired with the
  // employer domain; a bare name matches the wrong person too often.
  const hasStrongIdentifier =
    isDefined(params.email) || isDefined(params.linkedinUrl);
  const hasNameAndDomain =
    (isDefined(params.firstName) || isDefined(params.lastName)) &&
    isDefined(params.domain);

  return hasStrongIdentifier || hasNameAndDomain ? params : undefined;
};

const updatePerson = async ({
  client,
  recordId,
  data,
}: {
  client: CoreApiClient;
  recordId: string;
  data: Record<string, unknown>;
}): Promise<void> => {
  await client.mutation({
    updatePerson: { __args: { id: recordId, data }, id: true },
  });
};

export const enrichPersonHandler = async ({
  recordId,
  revealPersonalEmails = false,
}: {
  recordId: string;
  revealPersonalEmails?: boolean;
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

  const params = buildMatchParams(person);

  if (!isDefined(params)) {
    return {
      success: false,
      recordId,
      status: 'SKIPPED',
      updatedFields: [],
      message:
        'Person has no email, LinkedIn profile, or name plus employer domain for Apollo to match on.',
    };
  }

  const enrichedAt = new Date().toISOString();
  const matchResult = await fetchApolloPerson({
    params,
    apiKey,
    revealPersonalEmails,
  });

  if (!matchResult.success) {
    await updatePerson({
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
    await updatePerson({
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

  await updatePerson({ client, recordId, data });

  return {
    success: true,
    recordId,
    status: 'ENRICHED',
    updatedFields: Object.keys(data),
    message: 'Enriched person from Apollo.',
  };
};

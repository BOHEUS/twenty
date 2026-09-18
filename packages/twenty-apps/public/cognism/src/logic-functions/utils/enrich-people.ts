import { COGNISM_API_PATHS } from 'src/constants/cognism-api-paths';
import { runCognismEnrichment } from 'src/logic-functions/utils/run-cognism-enrichment';
import { type CognismEnrichResult } from 'src/logic-functions/types/cognism-enrich-result';
import { type CognismPersonData } from 'src/logic-functions/types/cognism-person-data';
import { type CognismPersonEnrichParams } from 'src/logic-functions/types/cognism-person-enrich-params';
import { pruneUndefined } from 'src/logic-functions/data/prune-undefined';

export const enrichPeople = (
  params: CognismPersonEnrichParams[],
): Promise<CognismEnrichResult<CognismPersonData>[]> =>
  runCognismEnrichment<CognismPersonData>({
    enrichPath: COGNISM_API_PATHS.contactEnrich,
    redeemPath: COGNISM_API_PATHS.contactRedeem,
    collectionKey: 'contacts',
    requests: params.map((entry) => ({
      criteria: pruneUndefined<unknown>({
        id: entry.cognismId,
        linkedinUrl: entry.linkedinUrl,
        email: entry.email,
        firstName: entry.firstName,
        lastName: entry.lastName,
        accountName: entry.accountName,
        accountDomain: entry.accountDomain,
      }),
      minMatchScore: entry.minMatchScore,
    })),
  });

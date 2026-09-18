import { COGNISM_API_PATHS } from 'src/constants/cognism-api-paths';
import { runCognismEnrichment } from 'src/logic-functions/utils/run-cognism-enrichment';
import { type CognismCompanyData } from 'src/logic-functions/types/cognism-company-data';
import { type CognismCompanyEnrichParams } from 'src/logic-functions/types/cognism-company-enrich-params';
import { type CognismEnrichResult } from 'src/logic-functions/types/cognism-enrich-result';
import { pruneUndefined } from 'src/logic-functions/data/prune-undefined';

export const enrichCompanies = (
  params: CognismCompanyEnrichParams[],
): Promise<CognismEnrichResult<CognismCompanyData>[]> =>
  runCognismEnrichment<CognismCompanyData>({
    enrichPath: COGNISM_API_PATHS.accountEnrich,
    redeemPath: COGNISM_API_PATHS.accountRedeem,
    collectionKey: 'accounts',
    requests: params.map((entry) => ({
      criteria: pruneUndefined<unknown>({
        id: entry.cognismId,
        domain: entry.domain,
        name: entry.name,
        linkedinUrl: entry.linkedinUrl,
      }),
      minMatchScore: entry.minMatchScore,
    })),
  });

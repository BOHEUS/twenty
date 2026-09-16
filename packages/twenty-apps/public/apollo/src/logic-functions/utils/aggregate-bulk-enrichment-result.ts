import { type BulkEnrichmentResult } from 'src/logic-functions/types/bulk-enrichment-result.type';
import { type EnrichmentResult } from 'src/logic-functions/types/enrichment-result.type';

export const aggregateBulkEnrichmentResult = (
  results: EnrichmentResult[],
): BulkEnrichmentResult => {
  const countByStatus = (status: EnrichmentResult['status']): number =>
    results.filter((result) => result.status === status).length;

  const errored = countByStatus('ERROR');

  return {
    success: errored === 0,
    total: results.length,
    enriched: countByStatus('ENRICHED'),
    notFound: countByStatus('NOT_FOUND'),
    skipped: countByStatus('SKIPPED'),
    errored,
    results,
  };
};

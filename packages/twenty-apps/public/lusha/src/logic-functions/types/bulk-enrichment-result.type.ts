import { type EnrichmentResult } from 'src/logic-functions/types/enrichment-result.type';

export type BulkEnrichmentResult = {
  success: boolean;
  total: number;
  enriched: number;
  notFound: number;
  skipped: number;
  errored: number;
  results: EnrichmentResult[];
};

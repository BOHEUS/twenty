import { type EnrichResult } from 'src/logic-functions/types/enrich-result';

export type BulkEnrichResult = {
  success: boolean;
  total: number;
  matched: number;
  notFound: number;
  skipped: number;
  errored: number;
  results: EnrichResult[];
};

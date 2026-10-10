import { type EnrichResult } from 'src/types/enrich-result';

export type BulkEnrichResult = {
  success: boolean;
  total: number;
  matched: number;
  pending: number;
  notFound: number;
  skipped: number;
  errored: number;
  results: EnrichResult[];
};

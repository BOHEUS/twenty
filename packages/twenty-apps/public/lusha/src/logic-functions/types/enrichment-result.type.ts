import { type LushaEnrichmentStatus } from 'src/constants/enrichment-status-options.constant';

export type EnrichmentResult = {
  success: boolean;
  recordId: string;
  status: LushaEnrichmentStatus | 'SKIPPED';
  updatedFields: string[];
  message: string;
};

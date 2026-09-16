import { type ApolloEnrichmentStatus } from 'src/constants/enrichment-status-options.constant';

export type EnrichmentResult = {
  success: boolean;
  recordId: string;
  status: ApolloEnrichmentStatus | 'SKIPPED';
  updatedFields: string[];
  message: string;
};

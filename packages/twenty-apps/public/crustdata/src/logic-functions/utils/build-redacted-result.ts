import { type EnrichResult } from 'src/types/enrich-result';

export const buildRedactedResult = (recordId: string): EnrichResult => ({
  success: true,
  recordId,
  status: 'REDACTED',
  updatedFields: [],
  message:
    'This person asked Crustdata to remove their data, so no enrichment is available.',
});

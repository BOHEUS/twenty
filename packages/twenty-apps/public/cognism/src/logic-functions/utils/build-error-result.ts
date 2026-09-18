import { type EnrichResult } from 'src/logic-functions/types/enrich-result';

export const ENRICHMENT_FAILED_MESSAGE = 'Cognism enrichment failed.';

export const buildErrorResult = ({
  recordId,
  error,
}: {
  recordId: string;
  error: string;
}): EnrichResult => ({
  success: false,
  recordId,
  status: 'ERROR',
  updatedFields: [],
  message: ENRICHMENT_FAILED_MESSAGE,
  error,
});

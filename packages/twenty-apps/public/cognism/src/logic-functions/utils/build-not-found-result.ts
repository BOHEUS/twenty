import { type EnrichResult } from 'src/logic-functions/types/enrich-result';

export const buildNotFoundResult = (recordId: string): EnrichResult => ({
  success: true,
  recordId,
  status: 'NOT_FOUND',
  updatedFields: [],
  message: 'Cognism returned no confident match.',
});

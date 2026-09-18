import { type EnrichResult } from 'src/logic-functions/types/enrich-result';

export const buildMatchedResult = ({
  recordId,
  updatedFields,
  data,
}: {
  recordId: string;
  updatedFields: string[];
  data?: Record<string, unknown>;
}): EnrichResult => ({
  success: true,
  recordId,
  status: 'MATCHED',
  updatedFields,
  data,
  message:
    updatedFields.length > 0
      ? `Enriched with Cognism (${updatedFields.length} fields).`
      : 'Matched Cognism data; no fields updated.',
});

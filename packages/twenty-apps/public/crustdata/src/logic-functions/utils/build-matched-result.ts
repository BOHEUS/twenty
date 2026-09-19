import { type EnrichResult } from 'src/types/enrich-result';

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
      ? `Enriched with Crustdata (${updatedFields.length} fields).`
      : 'Matched Crustdata data; no fields updated.',
});

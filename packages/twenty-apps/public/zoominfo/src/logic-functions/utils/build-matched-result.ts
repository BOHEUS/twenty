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
      ? `Enriched with ZoomInfo (${updatedFields.length} fields).`
      : 'Matched ZoomInfo data; no fields updated.',
});

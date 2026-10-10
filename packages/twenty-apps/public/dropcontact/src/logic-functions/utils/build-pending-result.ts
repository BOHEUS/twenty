import { type EnrichResult } from 'src/types/enrich-result';

export const buildPendingResult = ({
  recordId,
  isRequestIdStored,
}: {
  recordId: string;
  isRequestIdStored: boolean;
}): EnrichResult => ({
  success: true,
  recordId,
  status: 'PENDING',
  updatedFields: [],
  message: isRequestIdStored
    ? 'Dropcontact is still processing this contact. Run the enrichment again to collect the result.'
    : 'Dropcontact is still processing this contact. Its result cannot be collected later because fields are not being updated.',
});

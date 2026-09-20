import { type EnrichResult } from 'src/types/enrich-result';

export const buildPendingResult = ({
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
  status: 'PENDING',
  updatedFields,
  data,
  message:
    'RocketReach is still searching for this profile. Run the enrichment again to collect the finished result.',
});

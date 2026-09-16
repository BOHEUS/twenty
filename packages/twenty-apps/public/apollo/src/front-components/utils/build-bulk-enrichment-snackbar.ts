import { type BulkEnrichmentResult } from 'src/logic-functions/types/bulk-enrichment-result.type';

type BulkEnrichmentSnackbar = {
  message: string;
  variant: 'success' | 'error';
  detailedMessage?: string;
};

export const buildBulkEnrichmentSnackbar = ({
  total,
  enriched,
  notFound,
  skipped,
  errored,
}: BulkEnrichmentResult): BulkEnrichmentSnackbar => {
  const details = [
    notFound > 0 ? `${notFound} not found in Apollo` : undefined,
    skipped > 0 ? `${skipped} without a key Apollo can match on` : undefined,
    errored > 0 ? `${errored} failed` : undefined,
  ].filter((detail): detail is string => detail !== undefined);

  return {
    message: `Enriched ${enriched} of ${total} ${total === 1 ? 'record' : 'records'}.`,
    variant: errored > 0 ? 'error' : 'success',
    detailedMessage: details.length > 0 ? `${details.join(', ')}.` : undefined,
  };
};

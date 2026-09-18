import { isDefined } from 'twenty-sdk/utils';

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
  creditsCharged,
  results,
}: BulkEnrichmentResult): BulkEnrichmentSnackbar => {
  const counts = [
    notFound > 0 ? `${notFound} not found in Lusha` : undefined,
    skipped > 0 ? `${skipped} without anything Lusha can match on` : undefined,
    errored > 0 ? `${errored} failed` : undefined,
  ].filter(isDefined);

  const firstErrorMessage = results.find(
    (result) => result.status === 'ERROR',
  )?.message;

  const detailedMessage = [
    counts.length > 0 ? `${counts.join(', ')}.` : undefined,
    creditsCharged > 0
      ? `${creditsCharged} Lusha credit${creditsCharged === 1 ? '' : 's'} spent.`
      : undefined,
    firstErrorMessage,
  ]
    .filter(isDefined)
    .join(' ');

  return {
    message: `Enriched ${enriched} of ${total} ${total === 1 ? 'record' : 'records'} with Lusha.`,
    variant: errored > 0 ? 'error' : 'success',
    detailedMessage: detailedMessage === '' ? undefined : detailedMessage,
  };
};

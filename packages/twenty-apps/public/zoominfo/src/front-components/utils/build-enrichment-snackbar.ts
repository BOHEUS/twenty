import { type SnackBarVariant } from 'twenty-sdk/front-component';

import { type BulkEnrichResult } from 'src/types/bulk-enrich-result';

export const buildEnrichmentSnackbar = (
  result: BulkEnrichResult,
): { message: string; variant: SnackBarVariant } => {
  const { total, matched, notFound, skipped, errored } = result;

  if (total === 0) {
    return { message: 'No records to enrich.', variant: 'info' };
  }

  if (errored === total) {
    return {
      message: `ZoomInfo enrichment failed for all ${total} records.`,
      variant: 'error',
    };
  }

  const outcomes = [
    matched > 0 ? `${matched} enriched` : undefined,
    notFound > 0 ? `${notFound} no match` : undefined,
    skipped > 0 ? `${skipped} skipped` : undefined,
    errored > 0 ? `${errored} failed` : undefined,
  ].filter((outcome) => outcome !== undefined);

  return {
    message: `${outcomes.join(', ')}.`,
    variant: errored > 0 ? 'warning' : matched > 0 ? 'success' : 'info',
  };
};

import { type EnqueueSnackbarParams } from 'twenty-sdk/front-component';

import { type BulkEnrichResult } from 'src/types/bulk-enrich-result';
import { isDefined } from 'src/logic-functions/utils/is-defined';

export const buildEnrichmentSnackbarParams = ({
  total,
  pending,
  errored,
  results,
}: BulkEnrichResult): EnqueueSnackbarParams => {
  const firstErrorMessage = results.find((result) =>
    isDefined(result.error),
  )?.error;

  if (errored === total && total > 0) {
    return {
      message: 'Records enrichment failed',
      variant: 'error',
      detailedMessage: firstErrorMessage,
    };
  }

  if (errored > 0) {
    return {
      message: `Could not enrich ${errored} of ${total} records.`,
      variant: 'warning',
      detailedMessage: firstErrorMessage,
    };
  }

  if (pending > 0) {
    return {
      message: `RocketReach is still searching for ${pending} of ${total} records. Run the enrichment again to collect them.`,
      variant: 'warning',
    };
  }

  return {
    message: `Enriched ${total > 1 ? 'records.' : 'record.'}`,
    variant: 'success',
  };
};

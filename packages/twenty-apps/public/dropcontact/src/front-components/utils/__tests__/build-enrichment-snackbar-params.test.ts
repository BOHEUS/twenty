import { describe, expect, it } from 'vitest';

import { DROPCONTACT_ACCESS_ERROR_MESSAGE } from 'src/constants/dropcontact-access-error-message';
import { buildEnrichmentSnackbarParams } from 'src/front-components/utils/build-enrichment-snackbar-params';
import { aggregateBulkEnrichResult } from 'src/logic-functions/utils/aggregate-bulk-enrich-result';
import { buildErrorResult } from 'src/logic-functions/utils/build-error-result';
import { buildMatchedResult } from 'src/logic-functions/utils/build-matched-result';
import { buildNotFoundResult } from 'src/logic-functions/utils/build-not-found-result';
import { buildPendingResult } from 'src/logic-functions/utils/build-pending-result';

describe('buildEnrichmentSnackbarParams', () => {
  it('reports a success when no record failed', () => {
    expect(
      buildEnrichmentSnackbarParams(
        aggregateBulkEnrichResult([
          buildMatchedResult({ recordId: 'a', updatedFields: [] }),
          buildNotFoundResult('b'),
        ]),
      ),
    ).toEqual({ message: 'Enriched records.', variant: 'success' });
  });

  it('tells the user to run again when records are still pending', () => {
    expect(
      buildEnrichmentSnackbarParams(
        aggregateBulkEnrichResult([
          buildMatchedResult({ recordId: 'a', updatedFields: [] }),
          buildPendingResult({ recordId: 'b', isRequestIdStored: true }),
        ]),
      ),
    ).toEqual({
      message:
        'Dropcontact is still processing 1 of 2 records. Run the enrichment again in a few minutes to collect them.',
      variant: 'info',
    });
  });

  it('uses the singular form when a single record was enriched', () => {
    expect(
      buildEnrichmentSnackbarParams(
        aggregateBulkEnrichResult([
          buildMatchedResult({ recordId: 'a', updatedFields: [] }),
        ]),
      ),
    ).toEqual({ message: 'Enriched record.', variant: 'success' });
  });

  it('reports an error with the first record error when every record failed', () => {
    expect(
      buildEnrichmentSnackbarParams(
        aggregateBulkEnrichResult([
          buildErrorResult({
            recordId: 'a',
            error: DROPCONTACT_ACCESS_ERROR_MESSAGE,
          }),
          buildErrorResult({
            recordId: 'b',
            error: DROPCONTACT_ACCESS_ERROR_MESSAGE,
          }),
        ]),
      ),
    ).toEqual({
      message: 'Records enrichment failed',
      variant: 'error',
      detailedMessage:
        'Dropcontact enrichment is unavailable. Contact your workspace admin.',
    });
  });

  it('reports a warning with the first record error when some records failed', () => {
    expect(
      buildEnrichmentSnackbarParams(
        aggregateBulkEnrichResult([
          buildMatchedResult({ recordId: 'a', updatedFields: [] }),
          buildErrorResult({ recordId: 'b', error: 'update failed' }),
          buildErrorResult({ recordId: 'c', error: 'build failed' }),
        ]),
      ),
    ).toEqual({
      message: 'Could not enrich 2 of 3 records.',
      variant: 'warning',
      detailedMessage: 'update failed',
    });
  });
});

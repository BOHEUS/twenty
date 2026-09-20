import { describe, expect, it } from 'vitest';

import { buildEnrichmentSnackbarParams } from 'src/front-components/utils/build-enrichment-snackbar-params';
import { type BulkEnrichResult } from 'src/types/bulk-enrich-result';

const bulkEnrichResult = (
  overrides: Partial<BulkEnrichResult>,
): BulkEnrichResult => ({
  success: true,
  total: 0,
  matched: 0,
  pending: 0,
  notFound: 0,
  skipped: 0,
  errored: 0,
  results: [],
  ...overrides,
});

describe('buildEnrichmentSnackbarParams', () => {
  it('reports success when everything matched', () => {
    expect(
      buildEnrichmentSnackbarParams(
        bulkEnrichResult({ total: 2, matched: 2 }),
      ),
    ).toEqual({ message: 'Enriched records.', variant: 'success' });
  });

  it('warns that pending lookups need another run', () => {
    expect(
      buildEnrichmentSnackbarParams(
        bulkEnrichResult({ total: 3, matched: 1, pending: 2 }),
      ),
    ).toEqual({
      message:
        'RocketReach is still searching for 2 of 3 records. Run the enrichment again to collect them.',
      variant: 'warning',
    });
  });

  it('surfaces the first error when the whole run failed', () => {
    expect(
      buildEnrichmentSnackbarParams(
        bulkEnrichResult({
          total: 1,
          errored: 1,
          results: [
            {
              success: false,
              recordId: 'record-1',
              status: 'ERROR',
              updatedFields: [],
              message: 'RocketReach enrichment failed.',
              error: 'Invalid API key',
            },
          ],
        }),
      ),
    ).toEqual({
      message: 'Records enrichment failed',
      variant: 'error',
      detailedMessage: 'Invalid API key',
    });
  });

  it('warns on a partial failure', () => {
    expect(
      buildEnrichmentSnackbarParams(
        bulkEnrichResult({ total: 4, matched: 3, errored: 1 }),
      ),
    ).toMatchObject({
      message: 'Could not enrich 1 of 4 records.',
      variant: 'warning',
    });
  });
});

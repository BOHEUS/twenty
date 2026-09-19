import { describe, expect, it } from 'vitest';

import { buildEnrichmentSnackbar } from 'src/front-components/utils/build-enrichment-snackbar';
import { type BulkEnrichResult } from 'src/types/bulk-enrich-result';

const buildResult = (counts: Partial<BulkEnrichResult>): BulkEnrichResult => ({
  success: true,
  total: 0,
  matched: 0,
  notFound: 0,
  skipped: 0,
  errored: 0,
  results: [],
  ...counts,
});

describe('buildEnrichmentSnackbar', () => {
  it('does not claim success for records that were never enriched', () => {
    expect(
      buildEnrichmentSnackbar(buildResult({ total: 25, skipped: 25 })),
    ).toEqual({ message: '25 skipped.', variant: 'info' });
  });

  it('reports every outcome of a mixed run', () => {
    expect(
      buildEnrichmentSnackbar(
        buildResult({
          total: 25,
          matched: 12,
          notFound: 8,
          skipped: 4,
          errored: 1,
        }),
      ),
    ).toEqual({
      message: '12 enriched, 8 no match, 4 skipped, 1 failed.',
      variant: 'warning',
    });
  });

  it('reports a clean run as a success', () => {
    expect(
      buildEnrichmentSnackbar(buildResult({ total: 3, matched: 3 })),
    ).toEqual({ message: '3 enriched.', variant: 'success' });
  });

  it('reports a total failure as an error', () => {
    expect(
      buildEnrichmentSnackbar(buildResult({ total: 4, errored: 4 })),
    ).toEqual({
      message: 'ZoomInfo enrichment failed for all 4 records.',
      variant: 'error',
    });
  });

  it('handles an empty selection', () => {
    expect(buildEnrichmentSnackbar(buildResult({}))).toEqual({
      message: 'No records to enrich.',
      variant: 'info',
    });
  });
});

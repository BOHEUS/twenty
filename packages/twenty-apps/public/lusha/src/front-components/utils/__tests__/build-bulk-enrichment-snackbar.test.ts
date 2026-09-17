import { describe, expect, it } from 'vitest';

import { buildBulkEnrichmentSnackbar } from 'src/front-components/utils/build-bulk-enrichment-snackbar';

const bulkEnrichmentResult = {
  success: true,
  total: 3,
  enriched: 3,
  notFound: 0,
  skipped: 0,
  errored: 0,
  results: [],
};

describe('buildBulkEnrichmentSnackbar', () => {
  it('should report a run where every record was enriched', () => {
    expect(buildBulkEnrichmentSnackbar(bulkEnrichmentResult)).toEqual({
      message: 'Enriched 3 of 3 records with Lusha.',
      variant: 'success',
      detailedMessage: undefined,
    });
  });

  it('should detail the records that were not enriched', () => {
    expect(
      buildBulkEnrichmentSnackbar({
        ...bulkEnrichmentResult,
        enriched: 1,
        notFound: 1,
        skipped: 1,
      }),
    ).toEqual({
      message: 'Enriched 1 of 3 records with Lusha.',
      variant: 'success',
      detailedMessage:
        '1 not found in Lusha, 1 without anything Lusha can match on.',
    });
  });

  it('should explain the first failure in an error snackbar', () => {
    expect(
      buildBulkEnrichmentSnackbar({
        success: false,
        total: 1,
        enriched: 0,
        notFound: 0,
        skipped: 0,
        errored: 1,
        results: [
          {
            success: false,
            recordId: 'person-1',
            status: 'ERROR',
            updatedFields: [],
            message: 'The Lusha account has run out of credits.',
          },
        ],
      }),
    ).toEqual({
      message: 'Enriched 0 of 1 record with Lusha.',
      variant: 'error',
      detailedMessage: '1 failed. The Lusha account has run out of credits.',
    });
  });
});

import { describe, expect, it } from 'vitest';

import { aggregateBulkEnrichResult } from 'src/logic-functions/utils/aggregate-bulk-enrich-result';
import { type EnrichResult } from 'src/types/enrich-result';

const result = (status: EnrichResult['status']): EnrichResult => ({
  success: status !== 'ERROR',
  recordId: `record-${status}`,
  status,
  updatedFields: [],
  message: '',
});

describe('aggregateBulkEnrichResult', () => {
  it('counts every status, redacted included', () => {
    expect(
      aggregateBulkEnrichResult([
        result('MATCHED'),
        result('NOT_FOUND'),
        result('REDACTED'),
        result('SKIPPED'),
      ]),
    ).toMatchObject({
      success: true,
      total: 4,
      matched: 1,
      notFound: 1,
      redacted: 1,
      skipped: 1,
      errored: 0,
    });
  });

  it('fails the run when any record errored', () => {
    expect(
      aggregateBulkEnrichResult([result('MATCHED'), result('ERROR')]),
    ).toMatchObject({ success: false, errored: 1 });
  });
});

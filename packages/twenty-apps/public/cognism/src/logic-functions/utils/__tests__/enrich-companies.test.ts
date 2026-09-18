import { beforeEach, describe, expect, it, vi } from 'vitest';

import { enrichCompanies } from 'src/logic-functions/utils/enrich-companies';
import { runCognismEnrichment } from 'src/logic-functions/utils/run-cognism-enrichment';

vi.mock('src/logic-functions/utils/run-cognism-enrichment', () => ({
  runCognismEnrichment: vi.fn(() => Promise.resolve([])),
}));

const runCognismEnrichmentMock = vi.mocked(runCognismEnrichment);

describe('enrichCompanies', () => {
  beforeEach(() => {
    runCognismEnrichmentMock.mockClear();
  });

  it('sends every record to the account endpoints with only the provided criteria', async () => {
    await enrichCompanies([
      { domain: 'acme.com', minMatchScore: 70 },
      { cognismId: 'abc' },
    ]);

    expect(runCognismEnrichmentMock).toHaveBeenCalledExactlyOnceWith({
      enrichPath: '/account/enrich',
      redeemPath: '/account/redeem',
      collectionKey: 'accounts',
      requests: [
        { criteria: { domain: 'acme.com' }, minMatchScore: 70 },
        { criteria: { id: 'abc' }, minMatchScore: undefined },
      ],
    });
  });
});

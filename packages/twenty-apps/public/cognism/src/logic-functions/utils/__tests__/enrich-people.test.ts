import { beforeEach, describe, expect, it, vi } from 'vitest';

import { enrichPeople } from 'src/logic-functions/utils/enrich-people';
import { runCognismEnrichment } from 'src/logic-functions/utils/run-cognism-enrichment';

vi.mock('src/logic-functions/utils/run-cognism-enrichment', () => ({
  runCognismEnrichment: vi.fn(() => Promise.resolve([])),
}));

const runCognismEnrichmentMock = vi.mocked(runCognismEnrichment);

describe('enrichPeople', () => {
  beforeEach(() => {
    runCognismEnrichmentMock.mockClear();
  });

  it('sends every record to the contact endpoints with only the provided criteria', async () => {
    await enrichPeople([
      { email: 'jane@acme.com', minMatchScore: 80 },
      { cognismId: 'abc' },
    ]);

    expect(runCognismEnrichmentMock).toHaveBeenCalledExactlyOnceWith({
      enrichPath: '/contact/enrich',
      redeemPath: '/contact/redeem',
      collectionKey: 'contacts',
      requests: [
        { criteria: { email: 'jane@acme.com' }, minMatchScore: 80 },
        { criteria: { id: 'abc' }, minMatchScore: undefined },
      ],
    });
  });
});

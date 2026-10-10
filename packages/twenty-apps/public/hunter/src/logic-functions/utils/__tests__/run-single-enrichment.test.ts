import { afterEach, describe, expect, it, vi } from 'vitest';

import { UPDATE_FIELDS_OPTIONS } from 'src/constants/update-fields-options';
import { COMPANY_NODE_MOCK } from 'src/logic-functions/__mocks__/company-node.mock';
import { createCoreApiClientMock } from 'src/logic-functions/__mocks__/create-core-api-client-mock';
import { companyEnrichmentAdapter } from 'src/logic-functions/handlers/company-enrichment-adapter';
import { enrichCompanies } from 'src/logic-functions/utils/enrich-companies';
import { runSingleEnrichment } from 'src/logic-functions/utils/run-single-enrichment';

vi.mock('src/logic-functions/utils/enrich-companies', () => ({
  enrichCompanies: vi.fn(),
}));

describe('runSingleEnrichment', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('enriches the one record through the batch adapter', async () => {
    vi.mocked(enrichCompanies).mockResolvedValue([{ outcome: 'not_found' }]);

    const client = createCoreApiClientMock({
      queryResult: {
        companies: {
          edges: [{ node: { ...COMPANY_NODE_MOCK, name: 'Acme' } }],
        },
      },
    });

    const result = await runSingleEnrichment({
      client,
      input: { recordId: 'c1', updateFields: UPDATE_FIELDS_OPTIONS.no },
      adapter: companyEnrichmentAdapter,
    });

    expect(enrichCompanies).toHaveBeenCalledExactlyOnceWith(['acme.com'], {
      deadline: expect.any(Number),
    });
    expect(result).toMatchObject({ recordId: 'c1', status: 'NOT_FOUND' });
  });
});

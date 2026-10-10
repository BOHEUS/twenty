import { describe, expect, it } from 'vitest';

import { createCoreApiClientMock } from 'src/logic-functions/__mocks__/create-core-api-client-mock';
import { PERSON_NODE_MOCK } from 'src/logic-functions/__mocks__/person-node.mock';
import { buildPersonMatchedData } from 'src/logic-functions/utils/build-person-matched-data';

const ENRICHED_AT = '2026-01-01T00:00:00.000Z';

describe('buildPersonMatchedData', () => {
  it('fills empty fields, writes amplemarket metadata, and skips company lookup when there is none', async () => {
    const client = createCoreApiClientMock();

    const { mappedData, persistData } = await buildPersonMatchedData({
      client,
      node: PERSON_NODE_MOCK,
      outcome: {
        data: {
          id: 'amplemarket1',
          email: 'jane@acme.com',
          first_name: 'Jane',
          last_name: 'Doe',
          title: 'CEO',
        },
      },
      enrichedAt: ENRICHED_AT,
      companyIdByMatchKeyCache: new Map(),
      overrideExistingValues: false,
      shouldPersist: true,
    });

    expect(persistData.name).toEqual({ firstName: 'Jane', lastName: 'Doe' });
    expect(persistData.jobTitle).toBe('CEO');
    expect(persistData.amplemarketEnrichmentStatus).toBe('MATCHED');
    expect(persistData.amplemarketLastEnrichedAt).toBe(ENRICHED_AT);
    expect('companyId' in persistData).toBe(false);

    expect(mappedData.name).toEqual({ firstName: 'Jane', lastName: 'Doe' });
    expect(mappedData.jobTitle).toBe('CEO');
    expect('amplemarketEnrichmentStatus' in mappedData).toBe(false);
    expect('amplemarketRawPayload' in mappedData).toBe(false);
  });

  it('overwrites a populated standard field when overrideExistingValues is set', async () => {
    const client = createCoreApiClientMock();

    const { persistData } = await buildPersonMatchedData({
      client,
      node: { ...PERSON_NODE_MOCK, jobTitle: 'Existing Title' },
      outcome: {
        data: { id: 'amplemarket1', title: 'CEO' },
      },
      enrichedAt: ENRICHED_AT,
      companyIdByMatchKeyCache: new Map(),
      overrideExistingValues: true,
      shouldPersist: true,
    });

    expect(persistData.jobTitle).toBe('CEO');
  });

  it('links a found-or-created company when the person has none', async () => {
    const client = createCoreApiClientMock({
      queryResult: { companies: { edges: [] } },
      mutationResult: { createCompany: { id: 'co-new' } },
    });

    const { persistData } = await buildPersonMatchedData({
      client,
      node: PERSON_NODE_MOCK,
      outcome: {
        data: {
          id: 'amplemarket1',
          email: 'jane@acme.com',
          company: { name: 'Acme', website: 'acme.com' },
        },
      },
      enrichedAt: ENRICHED_AT,
      companyIdByMatchKeyCache: new Map(),
      overrideExistingValues: false,
      shouldPersist: true,
    });

    expect(persistData.companyId).toBe('co-new');
  });

  it('returns mapped data with no persist data or company lookup when not persisting', async () => {
    const client = createCoreApiClientMock({
      queryResult: { companies: { edges: [] } },
      mutationResult: { createCompany: { id: 'co-new' } },
    });

    const { mappedData, persistData } = await buildPersonMatchedData({
      client,
      node: PERSON_NODE_MOCK,
      outcome: {
        data: {
          id: 'amplemarket1',
          first_name: 'Jane',
          title: 'CEO',
          company: { name: 'Acme', website: 'acme.com' },
        },
      },
      enrichedAt: ENRICHED_AT,
      companyIdByMatchKeyCache: new Map(),
      overrideExistingValues: false,
      shouldPersist: false,
    });

    expect(mappedData.jobTitle).toBe('CEO');
    expect(persistData).toEqual({});
    expect(client.mutation).not.toHaveBeenCalled();
  });
});

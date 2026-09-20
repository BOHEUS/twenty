import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ROCKETREACH_API_KEY_VARIABLE_NAME } from 'src/constants/server-variable-names';
import { createCoreApiClientMock } from 'src/logic-functions/__mocks__/create-core-api-client-mock';
import { rocketReachCompanyDataMock } from 'src/logic-functions/__mocks__/rocketreach-company-data.mock';
import { enrichCompanyCore } from 'src/logic-functions/handlers/enrich-company';
import { type CompanyNode } from 'src/types/company-node';

vi.mock('twenty-sdk/billing', () => ({
  chargeCredits: vi.fn(() => Promise.resolve()),
}));

const RECORD_ID = 'ec6a6a06-2f0d-4f2e-9bd3-0a3a1d2e3f40';

const identifiableCompany: Partial<CompanyNode> = {
  domainName: { primaryLinkUrl: 'analytical-engines.com' },
};

const createClient = ({
  node = identifiableCompany,
  mutations = [],
}: {
  node?: Partial<CompanyNode>;
  mutations?: Record<string, unknown>[];
} = {}) =>
  createCoreApiClientMock({
    queryResult: {
      companies: { edges: [{ node: { id: RECORD_ID, ...node } }] },
    },
    onMutation: (request) => mutations.push(request as Record<string, unknown>),
    mutationResult: { updateCompany: { id: RECORD_ID } },
  });

const stubResponse = (body: unknown, status = 200) => {
  const fetchMock = vi.fn((_url: string, _requestInit?: RequestInit) =>
    Promise.resolve(
      new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
      }),
    ),
  );
  vi.stubGlobal('fetch', fetchMock);

  return fetchMock;
};

const updateData = (mutation: Record<string, unknown>) =>
  (mutation.updateCompany as { __args: { data: Record<string, unknown> } })
    .__args.data;

beforeEach(() => {
  process.env[ROCKETREACH_API_KEY_VARIABLE_NAME] = 'secret-key';
});

afterEach(() => {
  delete process.env[ROCKETREACH_API_KEY_VARIABLE_NAME];
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe('enrichCompanyCore', () => {
  it('writes firmographics and marks the record matched', async () => {
    const fetchMock = stubResponse(rocketReachCompanyDataMock);
    const mutations: Record<string, unknown>[] = [];

    const result = await enrichCompanyCore({
      input: { recordId: RECORD_ID },
      client: createClient({ mutations }),
    });

    expect(result.status).toBe('MATCHED');
    expect(fetchMock.mock.calls[0][0]).toContain(
      'domain=analytical-engines.com',
    );
    expect(updateData(mutations[0])).toMatchObject({
      rocketReachEnrichmentStatus: 'MATCHED',
      rocketReachId: '987',
      rocketReachEmployeeCount: 120,
      rocketReachFoundedYear: 1843,
    });
  });

  it('fills the empty standard fields from the profile', async () => {
    stubResponse(rocketReachCompanyDataMock);
    const mutations: Record<string, unknown>[] = [];

    await enrichCompanyCore({
      input: { recordId: RECORD_ID },
      client: createClient({ mutations }),
    });

    const data = updateData(mutations[0]);
    expect(data.name).toBe('Analytical Engines Ltd');
    expect(data.annualRevenue).toEqual({
      amountMicros: 2_500_000_000_000,
      currencyCode: 'USD',
    });
    expect(data.address).toMatchObject({ addressCity: 'London' });
  });

  it('leaves a revenue the workspace already has', async () => {
    stubResponse(rocketReachCompanyDataMock);
    const mutations: Record<string, unknown>[] = [];

    await enrichCompanyCore({
      input: { recordId: RECORD_ID },
      client: createClient({
        node: {
          ...identifiableCompany,
          annualRevenue: { amountMicros: 1_000_000 },
        },
        mutations,
      }),
    });

    expect(updateData(mutations[0]).annualRevenue).toBeUndefined();
  });

  it('marks the record not found when RocketReach has no company', async () => {
    stubResponse({ detail: 'Not found' }, 404);
    const mutations: Record<string, unknown>[] = [];

    const result = await enrichCompanyCore({
      input: { recordId: RECORD_ID },
      client: createClient({ mutations }),
    });

    expect(result.status).toBe('NOT_FOUND');
  });

  it('skips a company with no identifier', async () => {
    const fetchMock = stubResponse({});

    const result = await enrichCompanyCore({
      input: { recordId: RECORD_ID },
      client: createClient({ node: {} }),
    });

    expect(result.status).toBe('SKIPPED');
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

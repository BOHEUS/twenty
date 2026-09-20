import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ROCKETREACH_ACCESS_ERROR_MESSAGE } from 'src/constants/rocketreach-access-error-message';
import { LOOKUP_POLL_MAX_ATTEMPTS } from 'src/constants/lookup-polling';
import { ROCKETREACH_API_KEY_VARIABLE_NAME } from 'src/constants/server-variable-names';
import { createCoreApiClientMock } from 'src/logic-functions/__mocks__/create-core-api-client-mock';
import { rocketReachPersonDataMock } from 'src/logic-functions/__mocks__/rocketreach-person-data.mock';
import { enrichPersonCore } from 'src/logic-functions/handlers/enrich-person';
import { type PersonNode } from 'src/types/person-node';

vi.mock('src/logic-functions/utils/sleep', () => ({
  sleep: () => Promise.resolve(),
}));

vi.mock('twenty-sdk/billing', () => ({
  chargeCredits: vi.fn(() => Promise.resolve()),
}));

const RECORD_ID = 'b4b0f4bb-06b7-4a2c-8e0e-9f2a1c6a0e21';

const identifiablePerson: Partial<PersonNode> = {
  emails: { primaryEmail: 'ada@example.com' },
};

const createClient = ({
  node = identifiablePerson,
  mutations = [],
}: {
  node?: Partial<PersonNode>;
  mutations?: Record<string, unknown>[];
} = {}) =>
  createCoreApiClientMock({
    queryResult: (request: unknown) =>
      'people' in (request as object)
        ? { people: { edges: [{ node: { id: RECORD_ID, ...node } }] } }
        : { companies: { edges: [] } },
    onMutation: (request) => mutations.push(request as Record<string, unknown>),
    mutationResult: (request: unknown) =>
      'createCompany' in (request as object)
        ? { createCompany: { id: 'company-1' } }
        : { updatePerson: { id: RECORD_ID } },
  });

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const stubResponses = (...bodies: { body: unknown; status?: number }[]) => {
  const fetchMock = vi.fn((_url: string, _requestInit?: RequestInit) =>
    Promise.resolve(new Response('{}')),
  );
  for (const { body, status } of bodies) {
    fetchMock.mockResolvedValueOnce(jsonResponse(body, status));
  }
  vi.stubGlobal('fetch', fetchMock);

  return fetchMock;
};

const updateData = (mutation: Record<string, unknown>) =>
  (mutation.updatePerson as { __args: { data: Record<string, unknown> } })
    .__args.data;

beforeEach(() => {
  process.env[ROCKETREACH_API_KEY_VARIABLE_NAME] = 'secret-key';
});

afterEach(() => {
  delete process.env[ROCKETREACH_API_KEY_VARIABLE_NAME];
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe('enrichPersonCore', () => {
  it('writes the enriched fields and marks the record matched', async () => {
    stubResponses({ body: rocketReachPersonDataMock });
    const mutations: Record<string, unknown>[] = [];

    const result = await enrichPersonCore({
      input: { recordId: RECORD_ID },
      client: createClient({
        node: {
          ...identifiablePerson,
          company: { id: 'company-1', name: 'Analytical Engines Ltd' },
        },
        mutations,
      }),
    });

    expect(result.status).toBe('MATCHED');
    expect(updateData(mutations[0])).toMatchObject({
      rocketReachEnrichmentStatus: 'MATCHED',
      rocketReachId: '1234',
      rocketReachSeniority: 'director',
    });
    expect(result.updatedFields).toContain('rocketReachId');
  });

  it('keeps an existing job title and fills only the empty standard fields', async () => {
    stubResponses({ body: rocketReachPersonDataMock });
    const mutations: Record<string, unknown>[] = [];

    await enrichPersonCore({
      input: { recordId: RECORD_ID },
      client: createClient({
        node: {
          ...identifiablePerson,
          jobTitle: 'Countess of Lovelace',
          company: { id: 'company-1', name: 'Analytical Engines Ltd' },
        },
        mutations,
      }),
    });

    const data = updateData(mutations[0]);
    expect(data.jobTitle).toBeUndefined();
    expect(data.phones).toMatchObject({ primaryPhoneNumber: '+442079461111' });
  });

  it('overwrites existing values when asked to', async () => {
    stubResponses({ body: rocketReachPersonDataMock });
    const mutations: Record<string, unknown>[] = [];

    await enrichPersonCore({
      input: { recordId: RECORD_ID, updateFields: 'Yes and overwrite' },
      client: createClient({
        node: {
          ...identifiablePerson,
          jobTitle: 'Countess of Lovelace',
          company: { id: 'company-1', name: 'Analytical Engines Ltd' },
        },
        mutations,
      }),
    });

    expect(updateData(mutations[0]).jobTitle).toBe(
      'Head of Analytical Engines',
    );
  });

  it('links the person to a company it creates from the employer fields', async () => {
    stubResponses({ body: rocketReachPersonDataMock });
    const mutations: Record<string, unknown>[] = [];

    await enrichPersonCore({
      input: { recordId: RECORD_ID },
      client: createClient({ mutations }),
    });

    const createCompanyData = (
      mutations[0].createCompany as {
        __args: { data: Record<string, unknown> };
      }
    ).__args.data;
    expect(createCompanyData).toMatchObject({
      name: 'Analytical Engines Ltd',
      rocketReachId: '987',
    });
    expect(createCompanyData.domainName).toMatchObject({
      primaryLinkUrl: 'analytical-engines.com',
    });
    expect(updateData(mutations[1]).companyId).toBe('company-1');
  });

  it('marks the record pending when RocketReach is still searching', async () => {
    const stillSearching = { body: [{ id: 1234, status: 'progress' }] };
    stubResponses(
      { body: { id: 1234, status: 'progress' } },
      ...Array.from({ length: LOOKUP_POLL_MAX_ATTEMPTS }, () => stillSearching),
    );
    const mutations: Record<string, unknown>[] = [];

    const result = await enrichPersonCore({
      input: { recordId: RECORD_ID },
      client: createClient({ mutations }),
    });

    expect(result.status).toBe('PENDING');
    expect(updateData(mutations[0])).toMatchObject({
      rocketReachEnrichmentStatus: 'PENDING',
      rocketReachId: '1234',
    });
  });

  it('finishes a pending lookup that completes while polling', async () => {
    stubResponses(
      { body: { id: 1234, status: 'progress' } },
      { body: [rocketReachPersonDataMock] },
    );

    const result = await enrichPersonCore({
      input: { recordId: RECORD_ID },
      client: createClient(),
    });

    expect(result.status).toBe('MATCHED');
  });

  it('collects the finished profile on a later run using the stored id', async () => {
    const fetchMock = stubResponses({ body: rocketReachPersonDataMock });

    const result = await enrichPersonCore({
      input: { recordId: RECORD_ID },
      client: createClient({
        node: { ...identifiablePerson, rocketReachId: '1234' },
      }),
    });

    expect(result.status).toBe('MATCHED');
    expect(fetchMock.mock.calls[0][0]).toContain('id=1234');
  });

  it('marks the record not found when RocketReach has no profile', async () => {
    stubResponses({ body: { detail: 'Not found' }, status: 404 });
    const mutations: Record<string, unknown>[] = [];

    const result = await enrichPersonCore({
      input: { recordId: RECORD_ID },
      client: createClient({ mutations }),
    });

    expect(result.status).toBe('NOT_FOUND');
    expect(
      (
        mutations[0].updatePeople as {
          __args: { data: Record<string, unknown> };
        }
      ).__args.data.rocketReachEnrichmentStatus,
    ).toBe('NOT_FOUND');
  });

  it('skips a record with no identifier without calling RocketReach', async () => {
    const fetchMock = stubResponses();

    const result = await enrichPersonCore({
      input: { recordId: RECORD_ID },
      client: createClient({
        node: { name: { firstName: 'Ada', lastName: 'Lovelace' } },
      }),
    });

    expect(result.status).toBe('SKIPPED');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('hides a RocketReach account error behind an admin-facing message', async () => {
    stubResponses({ body: { detail: 'Invalid API key' }, status: 401 });

    const result = await enrichPersonCore({
      input: { recordId: RECORD_ID },
      client: createClient(),
    });

    expect(result.status).toBe('ERROR');
    expect(result.error).toBe(ROCKETREACH_ACCESS_ERROR_MESSAGE);
  });

  it('returns the mapped data without writing when updates are off', async () => {
    stubResponses({ body: rocketReachPersonDataMock });
    const mutations: Record<string, unknown>[] = [];

    const result = await enrichPersonCore({
      input: { recordId: RECORD_ID, updateFields: 'No' },
      client: createClient({ mutations }),
    });

    expect(result.status).toBe('MATCHED');
    expect(result.updatedFields).toEqual([]);
    expect(mutations).toEqual([]);
  });
});

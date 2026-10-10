import { beforeEach, describe, expect, it, vi } from 'vitest';
import { type CoreApiClient } from 'twenty-client-sdk/core';

import { UPDATE_FIELDS_OPTIONS } from 'src/constants/update-fields-options';
import { createCoreApiClientMock } from 'src/logic-functions/__mocks__/create-core-api-client-mock';
import { PERSON_NODE_MOCK } from 'src/logic-functions/__mocks__/person-node.mock';
import { enrichPeopleCore } from 'src/logic-functions/handlers/enrich-people';
import { enrichPeople } from 'src/logic-functions/utils/enrich-people';
import { type PersonNode } from 'src/types/person-node';

vi.mock('src/logic-functions/utils/enrich-people', () => ({
  enrichPeople: vi.fn(),
}));

const enrichPeopleMock = vi.mocked(enrichPeople);

type Captured = {
  updatePerson?: Record<string, unknown>;
  updatePeople?: { filter: unknown; data: Record<string, unknown> };
  companiesQueried?: boolean;
  createCompanyCalled?: boolean;
};

type MutationRequest = {
  updatePerson?: { __args: { id: string; data: Record<string, unknown> } };
  updatePeople?: { __args: { filter: unknown; data: Record<string, unknown> } };
  createCompany?: unknown;
};

const captureMutation = (captured: Captured) => (request: unknown) => {
  const mutation = request as MutationRequest;
  if (mutation.updatePerson) {
    captured.updatePerson = mutation.updatePerson.__args.data;
  }
  if (mutation.updatePeople) {
    captured.updatePeople = {
      filter: mutation.updatePeople.__args.filter,
      data: mutation.updatePeople.__args.data,
    };
  }
  if ('createCompany' in mutation) {
    captured.createCompanyCalled = true;
  }
};

const buildClient = (options: {
  people: PersonNode[];
  captured: Captured;
  createCompanyId?: string;
}): CoreApiClient =>
  createCoreApiClientMock({
    queryResult: (request: unknown) => {
      if ('companies' in (request as object)) {
        options.captured.companiesQueried = true;

        return { companies: { edges: [] } };
      }

      return { people: { edges: options.people.map((node) => ({ node })) } };
    },
    mutationResult: (request: unknown) =>
      'createCompany' in (request as object) &&
      options.createCompanyId !== undefined
        ? { createCompany: { id: options.createCompanyId } }
        : {},
    onMutation: captureMutation(options.captured),
  });

const runOne = (client: CoreApiClient, recordId = 'p1') =>
  enrichPeopleCore({ input: { records: [{ id: recordId }] }, client });

beforeEach(() => {
  enrichPeopleMock.mockReset();
});

describe('enrichPeopleCore', () => {
  it('fills empty standard fields and writes dropcontact metadata via updatePerson on a match', async () => {
    enrichPeopleMock.mockResolvedValue([
      {
        outcome: 'matched',
        data: {
          first_name: 'Jane',
          last_name: 'Doe',
          email: [{ email: 'jane@acme.com', qualification: 'nominative@pro' }],
          job: 'CEO',
          linkedin: 'https://linkedin.com/in/new',
        },
      },
    ]);
    const captured: Captured = {};
    const client = buildClient({ people: [PERSON_NODE_MOCK], captured });

    const result = await runOne(client);

    expect(enrichPeopleMock).toHaveBeenCalledTimes(1);
    expect(result.matched).toBe(1);
    expect(captured.updatePerson?.name).toEqual({
      firstName: 'Jane',
      lastName: 'Doe',
    });
    expect(captured.updatePerson?.jobTitle).toBe('CEO');
    expect(captured.updatePerson?.emails).toMatchObject({
      primaryEmail: 'jane@acme.com',
    });
    expect(captured.updatePerson?.dropcontactEnrichmentStatus).toBe('MATCHED');
    expect(typeof captured.updatePerson?.dropcontactLastEnrichedAt).toBe(
      'string',
    );
    expect(captured.updatePerson?.dropcontactRawPayload).toMatchObject({});
    expect('linkedinLink' in (captured.updatePerson ?? {})).toBe(false);
  });

  it('links a found-or-created company when the person has none', async () => {
    enrichPeopleMock.mockResolvedValue([
      {
        outcome: 'matched',
        data: {
          email: [{ email: 'jane@acme.com', qualification: 'nominative@pro' }],
          company: 'Acme',
          website: 'acme.com',
        },
      },
    ]);
    const captured: Captured = {};
    const client = buildClient({
      people: [PERSON_NODE_MOCK],
      captured,
      createCompanyId: 'co-new',
    });

    await runOne(client);

    expect(captured.updatePerson?.companyId).toBe('co-new');
  });

  it('does not touch company when the person already has one', async () => {
    enrichPeopleMock.mockResolvedValue([
      {
        outcome: 'matched',
        data: {
          email: [{ email: 'jane@acme.com', qualification: 'nominative@pro' }],
          company: 'Acme',
        },
      },
    ]);
    const captured: Captured = {};
    const client = buildClient({
      people: [{ ...PERSON_NODE_MOCK, company: { id: 'co-existing' } }],
      captured,
    });

    await runOne(client);

    expect(captured.companiesQueried).toBeUndefined();
    expect(captured.createCompanyCalled).toBeUndefined();
    expect('companyId' in (captured.updatePerson ?? {})).toBe(false);
  });

  it('does not overwrite a populated standard field', async () => {
    enrichPeopleMock.mockResolvedValue([
      {
        outcome: 'matched',
        data: { job: 'CEO' },
      },
    ]);
    const captured: Captured = {};
    const client = buildClient({
      people: [{ ...PERSON_NODE_MOCK, jobTitle: 'Existing Title' }],
      captured,
    });

    await runOne(client);

    expect('jobTitle' in (captured.updatePerson ?? {})).toBe(false);
  });

  it('stores the request id and marks PENDING while Dropcontact is still processing', async () => {
    enrichPeopleMock.mockResolvedValue([
      { outcome: 'pending', requestId: 'request-1' },
    ]);
    const captured: Captured = {};
    const client = buildClient({ people: [PERSON_NODE_MOCK], captured });

    const result = await runOne(client);

    expect(result).toMatchObject({ pending: 1, errored: 0, success: true });
    expect(result.results[0].status).toBe('PENDING');
    expect(captured.updatePeople?.data).toEqual({
      dropcontactEnrichmentStatus: 'PENDING',
      dropcontactRequestId: 'request-1',
    });
  });

  it('passes the stored request id back so the batch is collected', async () => {
    enrichPeopleMock.mockResolvedValue([{ outcome: 'not_found' }]);
    const captured: Captured = {};
    const client = buildClient({
      people: [{ ...PERSON_NODE_MOCK, dropcontactRequestId: 'request-1' }],
      captured,
    });

    await runOne(client);

    expect(enrichPeopleMock.mock.calls[0][0][0].pendingRequestId).toBe(
      'request-1',
    );
    expect(captured.updatePeople?.data.dropcontactRequestId).toBeNull();
  });

  it('records NOT_FOUND and writes the status via a batched updatePeople', async () => {
    enrichPeopleMock.mockResolvedValue([{ outcome: 'not_found' }]);
    const captured: Captured = {};
    const client = buildClient({ people: [PERSON_NODE_MOCK], captured });

    const result = await runOne(client);

    expect(result.notFound).toBe(1);
    expect(captured.updatePerson).toBeUndefined();
    expect(Object.keys(captured.updatePeople?.data ?? {}).sort()).toEqual([
      'dropcontactEnrichmentStatus',
      'dropcontactLastEnrichedAt',
      'dropcontactRequestId',
    ]);
    expect(captured.updatePeople?.data.dropcontactEnrichmentStatus).toBe(
      'NOT_FOUND',
    );
    expect(captured.updatePeople?.filter).toEqual({ id: { in: ['p1'] } });
  });

  it('records ERROR and reports failure on a Dropcontact error', async () => {
    enrichPeopleMock.mockResolvedValue([
      { outcome: 'error', httpStatus: 500, message: 'boom' },
    ]);
    const captured: Captured = {};
    const client = buildClient({ people: [PERSON_NODE_MOCK], captured });

    const result = await runOne(client);

    expect(result.errored).toBe(1);
    expect(result.success).toBe(false);
    expect(result.results[0].error).toBe('boom');
    expect(captured.updatePeople?.data).toEqual({
      dropcontactEnrichmentStatus: 'ERROR',
      dropcontactLastEnrichedAt: expect.any(String),
    });
  });

  it('overwrites a populated standard field when updateFields is "Yes and overwrite"', async () => {
    enrichPeopleMock.mockResolvedValue([
      {
        outcome: 'matched',
        data: { job: 'CEO' },
      },
    ]);
    const captured: Captured = {};
    const client = buildClient({
      people: [{ ...PERSON_NODE_MOCK, jobTitle: 'Existing Title' }],
      captured,
    });

    await enrichPeopleCore({
      input: {
        records: [{ id: 'p1' }],
        updateFields: UPDATE_FIELDS_OPTIONS.overwrite,
      },
      client,
    });

    expect(captured.updatePerson?.jobTitle).toBe('CEO');
  });

  it('returns enriched data without writing when updateFields is "No"', async () => {
    enrichPeopleMock.mockResolvedValue([
      {
        outcome: 'matched',
        data: {
          first_name: 'Jane',
          job: 'CEO',
        },
      },
    ]);
    const captured: Captured = {};
    const client = buildClient({ people: [PERSON_NODE_MOCK], captured });

    const result = await enrichPeopleCore({
      input: {
        records: [{ id: 'p1' }],
        updateFields: UPDATE_FIELDS_OPTIONS.no,
      },
      client,
    });

    expect(result.matched).toBe(1);
    expect(result.results[0].updatedFields).toEqual([]);
    expect(result.results[0].data?.jobTitle).toBe('CEO');
    expect(captured.updatePerson).toBeUndefined();
    expect(captured.updatePeople).toBeUndefined();
    expect(captured.createCompanyCalled).toBeUndefined();
  });

  it('skips when there is no usable identifier', async () => {
    const captured: Captured = {};
    const client = buildClient({
      people: [{ ...PERSON_NODE_MOCK, linkedinLink: null }],
      captured,
    });

    const result = await runOne(client);

    expect(result.skipped).toBe(1);
    expect(enrichPeopleMock).not.toHaveBeenCalled();
  });

  it('marks a missing record as ERROR', async () => {
    const captured: Captured = {};
    const client = buildClient({ people: [], captured });

    const result = await runOne(client, 'missing');

    expect(result.errored).toBe(1);
    expect(result.results[0].error).toBe('Person missing not found');
    expect(enrichPeopleMock).not.toHaveBeenCalled();
  });

  it('batches the Dropcontact request and the not-found status write across records', async () => {
    enrichPeopleMock.mockResolvedValue([
      { outcome: 'not_found' },
      { outcome: 'not_found' },
    ]);
    const captured: Captured = {};
    const client = buildClient({
      people: [PERSON_NODE_MOCK, { ...PERSON_NODE_MOCK, id: 'p2' }],
      captured,
    });

    const result = await enrichPeopleCore({
      input: { records: [{ id: 'p1' }, { id: 'p2' }] },
      client,
    });

    expect(enrichPeopleMock).toHaveBeenCalledTimes(1);
    expect(captured.updatePeople?.filter).toEqual({ id: { in: ['p1', 'p2'] } });
    expect(result.notFound).toBe(2);
  });
});

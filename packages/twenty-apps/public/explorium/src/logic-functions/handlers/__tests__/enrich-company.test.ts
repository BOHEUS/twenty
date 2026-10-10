import { beforeEach, describe, expect, it, vi } from 'vitest';
import { type CoreApiClient } from 'twenty-client-sdk/core';

import { COMPANY_NODE_MOCK } from 'src/logic-functions/__mocks__/company-node.mock';
import { createCoreApiClientMock } from 'src/logic-functions/__mocks__/create-core-api-client-mock';
import { enrichCompanyCore } from 'src/logic-functions/handlers/enrich-company';
import { enrichCompanies } from 'src/logic-functions/utils/enrich-companies';
import { type CompanyNode } from 'src/types/company-node';

vi.mock('src/logic-functions/utils/enrich-companies', () => ({
  enrichCompanies: vi.fn(),
}));

const enrichCompaniesMock = vi.mocked(enrichCompanies);

type Captured = {
  updateCompany?: Record<string, unknown>;
  updateCompanies?: { filter: unknown; data: Record<string, unknown> };
};

type MutationRequest = {
  updateCompany?: { __args: { id: string; data: Record<string, unknown> } };
  updateCompanies?: {
    __args: { filter: unknown; data: Record<string, unknown> };
  };
};

const captureMutation = (captured: Captured) => (request: unknown) => {
  const mutation = request as MutationRequest;
  if (mutation.updateCompany) {
    captured.updateCompany = mutation.updateCompany.__args.data;
  }
  if (mutation.updateCompanies) {
    captured.updateCompanies = {
      filter: mutation.updateCompanies.__args.filter,
      data: mutation.updateCompanies.__args.data,
    };
  }
};

const buildClient = (
  companies: CompanyNode[],
  captured: Captured,
): CoreApiClient =>
  createCoreApiClientMock({
    queryResult: { companies: { edges: companies.map((node) => ({ node })) } },
    onMutation: captureMutation(captured),
  });

const runOne = (client: CoreApiClient, recordId = 'c1') =>
  enrichCompanyCore({ input: { recordId }, client });

beforeEach(() => {
  enrichCompaniesMock.mockReset();
});

describe('enrichCompanyCore', () => {
  it('fills empty standard fields and writes explorium metadata via updateCompany on a match', async () => {
    enrichCompaniesMock.mockResolvedValue([
      {
        outcome: 'matched',
        data: {
          business_id: 'exploriumc',
          name: 'Acme Corp',
          website: 'newsite.com',
          number_of_employees_range: '11-50',
        },
      },
    ]);
    const captured: Captured = {};
    const client = buildClient([COMPANY_NODE_MOCK], captured);

    const result = await runOne(client);

    expect(enrichCompaniesMock).toHaveBeenCalledTimes(1);
    expect(result.status).toBe('MATCHED');
    expect(result.success).toBe(true);
    expect(result.recordId).toBe('c1');
    expect(result.updatedFields).toContain('name');
    expect(captured.updateCompany?.name).toBe('Acme Corp');
    expect(captured.updateCompany?.exploriumEmployeeRange).toBe('_11_50');
    expect(captured.updateCompany?.exploriumEnrichmentStatus).toBe('MATCHED');
  });

  it('records NOT_FOUND and writes the status via updateCompanies', async () => {
    enrichCompaniesMock.mockResolvedValue([{ outcome: 'not_found' }]);
    const captured: Captured = {};
    const client = buildClient([COMPANY_NODE_MOCK], captured);

    const result = await runOne(client);

    expect(result.status).toBe('NOT_FOUND');
    expect(result.success).toBe(true);
    expect(captured.updateCompany).toBeUndefined();
    expect(captured.updateCompanies?.data.exploriumEnrichmentStatus).toBe(
      'NOT_FOUND',
    );
    expect(captured.updateCompanies?.filter).toEqual({ id: { in: ['c1'] } });
  });

  it('records ERROR and reports failure on a Explorium error', async () => {
    enrichCompaniesMock.mockResolvedValue([
      { outcome: 'error', httpStatus: 500, message: 'boom' },
    ]);
    const captured: Captured = {};
    const client = buildClient([COMPANY_NODE_MOCK], captured);

    const result = await runOne(client);

    expect(result.status).toBe('ERROR');
    expect(result.success).toBe(false);
    expect(result.error).toBe('boom');
    expect(captured.updateCompanies?.data).toEqual({
      exploriumEnrichmentStatus: 'ERROR',
      exploriumLastEnrichedAt: expect.any(String),
    });
  });

  it('skips when there is no usable identifier', async () => {
    const captured: Captured = {};
    const client = buildClient(
      [{ ...COMPANY_NODE_MOCK, domainName: null, name: '' }],
      captured,
    );

    const result = await runOne(client);

    expect(result.status).toBe('SKIPPED');
    expect(enrichCompaniesMock).not.toHaveBeenCalled();
  });

  it('marks a missing record as ERROR', async () => {
    const captured: Captured = {};
    const client = buildClient([], captured);

    const result = await runOne(client, 'missing');

    expect(result.status).toBe('ERROR');
    expect(result.error).toBe('Company missing not found');
    expect(enrichCompaniesMock).not.toHaveBeenCalled();
  });

  it('returns an ERROR without touching Explorium when no record id is provided', async () => {
    const captured: Captured = {};
    const client = buildClient([COMPANY_NODE_MOCK], captured);

    const result = await enrichCompanyCore({ input: {}, client });

    expect(result.status).toBe('ERROR');
    expect(result.error).toBe('No record id was provided to enrich.');
    expect(enrichCompaniesMock).not.toHaveBeenCalled();
  });
});

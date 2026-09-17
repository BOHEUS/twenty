import { type CoreApiClient } from 'twenty-client-sdk/core';
import { describe, expect, it, vi } from 'vitest';

import { LUSHA_CONTACT_MOCK } from 'src/logic-functions/__mocks__/lusha-contact.mock';
import { findOrCreateCompany } from 'src/logic-functions/utils/find-or-create-company';

const createClient = ({ existingCompanyId }: { existingCompanyId?: string }) =>
  ({
    query: vi.fn(() =>
      Promise.resolve({
        companies: {
          edges: existingCompanyId ? [{ node: { id: existingCompanyId } }] : [],
        },
      }),
    ),
    mutation: vi.fn(() =>
      Promise.resolve({ createCompany: { id: 'created-company' } }),
    ),
  }) as unknown as CoreApiClient & {
    query: ReturnType<typeof vi.fn>;
    mutation: ReturnType<typeof vi.fn>;
  };

describe('findOrCreateCompany', () => {
  it('should link the company that already has the contact domain', async () => {
    const client = createClient({ existingCompanyId: 'existing-company' });

    const companyId = await findOrCreateCompany({
      client,
      contact: LUSHA_CONTACT_MOCK,
      companyIdByDomain: new Map(),
    });

    expect(companyId).toBe('existing-company');
    expect(client.query).toHaveBeenCalledWith({
      companies: expect.objectContaining({
        __args: {
          filter: { domainName: { primaryLinkUrl: { eq: 'lusha.com' } } },
          first: 1,
        },
      }),
    });
    expect(client.mutation).not.toHaveBeenCalled();
  });

  it('should create the company when the workspace has none', async () => {
    const client = createClient({});

    const companyId = await findOrCreateCompany({
      client,
      contact: LUSHA_CONTACT_MOCK,
      companyIdByDomain: new Map(),
    });

    expect(companyId).toBe('created-company');
    expect(client.mutation).toHaveBeenCalledWith({
      createCompany: {
        __args: {
          data: {
            name: 'Lusha',
            domainName: {
              primaryLinkUrl: 'lusha.com',
              primaryLinkLabel: '',
              secondaryLinks: null,
            },
            lushaId: '16303253',
            lushaIndustry: 'Technology, Information & Media',
          },
        },
        id: true,
      },
    });
  });

  it('should create a new company once for people enriched together', async () => {
    const client = createClient({});
    const companyIdByDomain = new Map<string, Promise<string | undefined>>();

    const companyIds = await Promise.all([
      findOrCreateCompany({
        client,
        contact: LUSHA_CONTACT_MOCK,
        companyIdByDomain,
      }),
      findOrCreateCompany({
        client,
        contact: LUSHA_CONTACT_MOCK,
        companyIdByDomain,
      }),
    ]);

    expect(companyIds).toEqual(['created-company', 'created-company']);
    expect(client.query).toHaveBeenCalledTimes(1);
    expect(client.mutation).toHaveBeenCalledTimes(1);
  });

  it('should not link anything when Lusha gave no employer domain', async () => {
    const client = createClient({});

    const companyId = await findOrCreateCompany({
      client,
      contact: { ...LUSHA_CONTACT_MOCK, company: { name: 'Lusha' } },
      companyIdByDomain: new Map(),
    });

    expect(companyId).toBeUndefined();
    expect(client.query).not.toHaveBeenCalled();
  });
});

import { describe, expect, it, vi } from 'vitest';
import { type CoreApiClient } from 'twenty-client-sdk/core';

import { HUNTER_COMPANY_DATA_MOCK } from 'src/logic-functions/__mocks__/hunter-company-data.mock';
import { updateLinkedCompany } from 'src/logic-functions/utils/update-linked-company';

const buildClient = (domain: string | null) => {
  const mutation = vi.fn(async () => ({ updateCompany: { id: 'co1' } }));
  const client = {
    query: vi.fn(async () => ({
      companies: {
        edges: [
          {
            node: {
              id: 'co1',
              name: 'Acme',
              domainName: { primaryLinkUrl: domain },
            },
          },
        ],
      },
    })),
    mutation,
  } as unknown as CoreApiClient;

  return { client, mutation };
};

const run = (client: CoreApiClient) =>
  updateLinkedCompany({
    client,
    companyId: 'co1',
    company: HUNTER_COMPANY_DATA_MOCK,
    enrichedAt: '2026-10-11T00:00:00.000Z',
    overrideExistingValues: false,
  });

describe('updateLinkedCompany', () => {
  it('fills the linked company when its domain matches the employer', async () => {
    const { client, mutation } = buildClient('https://www.acme.com');

    await run(client);

    expect(mutation).toHaveBeenCalledTimes(1);
  });

  it('leaves a linked company with another domain untouched', async () => {
    const { client, mutation } = buildClient('initech.com');

    await run(client);

    expect(mutation).not.toHaveBeenCalled();
  });
});

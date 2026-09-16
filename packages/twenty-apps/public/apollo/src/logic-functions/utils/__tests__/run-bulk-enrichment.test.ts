import { type CoreApiClient } from 'twenty-client-sdk/core';
import { reportConnectionAuthFailure } from 'twenty-sdk/logic-function';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { type ApolloRecord } from 'src/logic-functions/types/apollo-record.type';
import { type BulkEnrichmentAdapter } from 'src/logic-functions/types/bulk-enrichment-adapter.type';
import { findApolloConnection } from 'src/logic-functions/utils/find-apollo-connection';
import { runBulkEnrichment } from 'src/logic-functions/utils/run-bulk-enrichment';

vi.mock('twenty-sdk/logic-function', () => ({
  reportConnectionAuthFailure: vi.fn(() => Promise.resolve()),
}));

vi.mock('src/logic-functions/utils/find-apollo-connection', () => ({
  findApolloConnection: vi.fn(),
}));

const context = { userWorkspaceId: null };

type FakeRecord = { id: string; domain?: string };

const client = {} as CoreApiClient;

const createAdapter = ({
  records,
  matches,
}: {
  records: FakeRecord[];
  matches: (ApolloRecord | undefined)[];
}): BulkEnrichmentAdapter<FakeRecord, string> => ({
  objectNameSingular: 'Company',
  noIdentifierMessage: 'Company has no domain.',
  notFoundMessage: 'Apollo returned no organization for this record.',
  readRecords: vi.fn(({ recordIds }) =>
    Promise.resolve(records.filter((record) => recordIds.includes(record.id))),
  ),
  buildMatchParams: (record) => record.domain,
  fetchMatches: vi.fn(({ params }: { params: string[] }) =>
    Promise.resolve({
      success: true as const,
      data: params.map((_, index) => matches[index]),
    }),
  ),
  buildData: ({ match, enrichedAt }) => ({
    apolloOrganizationId: match.id,
    apolloLastEnrichedAt: enrichedAt,
  }),
  updateRecord: vi.fn(() => Promise.resolve()),
  updateManyStatus: vi.fn(() => Promise.resolve()),
});

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(findApolloConnection).mockResolvedValue({
    id: 'connection-1',
    accessToken: 'access-token',
  } as Awaited<ReturnType<typeof findApolloConnection>>);
});

describe('runBulkEnrichment', () => {
  it('should enrich the records Apollo matched', async () => {
    const adapter = createAdapter({
      records: [
        { id: 'company-1', domain: 'apollo.io' },
        { id: 'company-2', domain: 'stripe.com' },
      ],
      matches: [{ id: 'org-1' }, { id: 'org-2' }],
    });

    const result = await runBulkEnrichment({
      input: { records: [{ id: 'company-1' }, { id: 'company-2' }] },
      adapter,
      context,
      client,
    });

    expect(result).toMatchObject({
      success: true,
      total: 2,
      enriched: 2,
      notFound: 0,
      skipped: 0,
      errored: 0,
    });
    expect(adapter.updateRecord).toHaveBeenCalledTimes(2);
    expect(adapter.updateRecord).toHaveBeenCalledWith(
      expect.objectContaining({
        recordId: 'company-1',
        data: expect.objectContaining({ apolloOrganizationId: 'org-1' }),
      }),
    );
    expect(result.results[0].updatedFields).toEqual([
      'apolloOrganizationId',
      'apolloLastEnrichedAt',
    ]);
  });

  it('should skip records Apollo has no key to match on, without calling Apollo for them', async () => {
    const adapter = createAdapter({
      records: [{ id: 'company-1' }, { id: 'company-2', domain: 'apollo.io' }],
      matches: [{ id: 'org-1' }],
    });

    const result = await runBulkEnrichment({
      input: { records: ['company-1', 'company-2'] },
      adapter,
      context,
      client,
    });

    expect(result).toMatchObject({ success: true, skipped: 1, enriched: 1 });
    expect(result.results[0]).toMatchObject({
      recordId: 'company-1',
      status: 'SKIPPED',
      message: 'Company has no domain.',
    });
    expect(adapter.fetchMatches).toHaveBeenCalledWith(
      expect.objectContaining({ params: ['apollo.io'] }),
    );
  });

  it('should mark records Apollo did not match as not found', async () => {
    const adapter = createAdapter({
      records: [{ id: 'company-1', domain: 'unknown.io' }],
      matches: [undefined],
    });

    const result = await runBulkEnrichment({
      input: { records: ['company-1'] },
      adapter,
      context,
      client,
    });

    expect(result).toMatchObject({ success: true, notFound: 1, enriched: 0 });
    expect(adapter.updateManyStatus).toHaveBeenCalledWith(
      expect.objectContaining({
        recordIds: ['company-1'],
        data: expect.objectContaining({
          apolloEnrichmentStatus: 'NOT_FOUND',
        }),
      }),
    );
    expect(adapter.updateRecord).not.toHaveBeenCalled();
  });

  it('should report an id that no longer exists', async () => {
    const adapter = createAdapter({ records: [], matches: [] });

    const result = await runBulkEnrichment({
      input: { records: ['company-1'] },
      adapter,
      context,
      client,
    });

    expect(result).toMatchObject({ success: false, errored: 1 });
    expect(result.results[0].message).toBe('Company company-1 was not found.');
    expect(adapter.fetchMatches).not.toHaveBeenCalled();
  });

  it('should fail every record of a batch Apollo refused, and write the error status', async () => {
    const adapter = {
      ...createAdapter({
        records: [{ id: 'company-1', domain: 'apollo.io' }],
        matches: [],
      }),
      fetchMatches: vi.fn(() =>
        Promise.resolve({
          success: false as const,
          error: 'Apollo API responded with 429: rate limit exceeded',
          isAuthFailure: false,
        }),
      ),
    };

    const result = await runBulkEnrichment({
      input: { records: ['company-1'] },
      adapter,
      context,
      client,
    });

    expect(result).toMatchObject({ success: false, errored: 1 });
    expect(result.results[0].message).toBe(
      'Apollo API responded with 429: rate limit exceeded',
    );
    expect(adapter.updateManyStatus).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ apolloEnrichmentStatus: 'ERROR' }),
      }),
    );
  });

  it('should report the records whose write failed and enrich the others', async () => {
    const adapter = {
      ...createAdapter({
        records: [
          { id: 'company-1', domain: 'apollo.io' },
          { id: 'company-2', domain: 'stripe.com' },
        ],
        matches: [{ id: 'org-1' }, { id: 'org-2' }],
      }),
      updateRecord: vi.fn(({ recordId }: { recordId: string }) =>
        recordId === 'company-1'
          ? Promise.reject(new Error('Record is read only'))
          : Promise.resolve(),
      ),
    };

    const result = await runBulkEnrichment({
      input: { records: ['company-1', 'company-2'] },
      adapter,
      context,
      client,
    });

    expect(result).toMatchObject({ success: false, enriched: 1, errored: 1 });
    expect(result.results[0]).toMatchObject({
      recordId: 'company-1',
      status: 'ERROR',
      message: 'Record is read only',
    });
  });

  it('should fill Apollo batches with matchable records only', async () => {
    const records = Array.from({ length: 11 }, (_, index) => ({
      id: `company-${index}`,
      domain: index % 5 === 0 ? `company-${index}.com` : undefined,
    }));
    const adapter = createAdapter({
      records,
      matches: [{ id: 'org-0' }, { id: 'org-5' }, { id: 'org-10' }],
    });

    const result = await runBulkEnrichment({
      input: { records: records.map(({ id }) => id) },
      adapter,
      context,
      client,
    });

    expect(result).toMatchObject({ total: 11, enriched: 3, skipped: 8 });
    expect(adapter.readRecords).toHaveBeenCalledTimes(1);
    expect(adapter.fetchMatches).toHaveBeenCalledTimes(1);
    expect(vi.mocked(adapter.fetchMatches).mock.calls[0][0].params).toEqual([
      'company-0.com',
      'company-5.com',
      'company-10.com',
    ]);
  });

  it('should send records to Apollo in batches of ten', async () => {
    const records = Array.from({ length: 12 }, (_, index) => ({
      id: `company-${index}`,
      domain: `company-${index}.com`,
    }));
    const adapter = createAdapter({
      records,
      matches: Array.from({ length: 12 }, (_, index) => ({
        id: `org-${index}`,
      })),
    });

    const result = await runBulkEnrichment({
      input: { records: records.map(({ id }) => id) },
      adapter,
      context,
      client,
    });

    expect(result).toMatchObject({ total: 12, enriched: 12 });
    expect(adapter.fetchMatches).toHaveBeenCalledTimes(2);
    expect(
      vi.mocked(adapter.fetchMatches).mock.calls[0][0].params,
    ).toHaveLength(10);
    expect(
      vi.mocked(adapter.fetchMatches).mock.calls[1][0].params,
    ).toHaveLength(2);
  });

  it('should fail every record when no Apollo account is connected', async () => {
    vi.mocked(findApolloConnection).mockResolvedValue(null);

    const adapter = createAdapter({
      records: [{ id: 'company-1', domain: 'apollo.io' }],
      matches: [{ id: 'org-1' }],
    });

    const result = await runBulkEnrichment({
      input: { records: ['company-1'] },
      adapter,
      context,
      client,
    });

    expect(result).toMatchObject({ success: false, errored: 1 });
    expect(result.results[0].message).toContain('Apollo is not connected');
    expect(adapter.readRecords).not.toHaveBeenCalled();
  });

  it('should report a rejected token and stop before the remaining batches', async () => {
    const records = Array.from({ length: 12 }, (_, index) => ({
      id: `company-${index}`,
      domain: `company-${index}.com`,
    }));
    const adapter = {
      ...createAdapter({ records, matches: [] }),
      fetchMatches: vi.fn(() =>
        Promise.resolve({
          success: false as const,
          error: 'Apollo API responded with 401: invalid token',
          isAuthFailure: true,
        }),
      ),
    };

    const result = await runBulkEnrichment({
      input: { records: records.map(({ id }) => id) },
      adapter,
      context,
      client,
    });

    expect(adapter.fetchMatches).toHaveBeenCalledTimes(1);
    expect(reportConnectionAuthFailure).toHaveBeenCalledWith(
      expect.objectContaining({ connectionId: 'connection-1' }),
    );
    // The batch Apollo rejected is reported; the records it never reached are
    // left out rather than guessed at.
    expect(result).toMatchObject({ success: false, total: 10, errored: 10 });
  });

  it('should pass the personal email option through to Apollo', async () => {
    const adapter = createAdapter({
      records: [{ id: 'person-1', domain: 'apollo.io' }],
      matches: [{ id: 'apollo-1' }],
    });

    await runBulkEnrichment({
      input: { records: ['person-1'], revealPersonalEmails: true },
      adapter,
      context,
      client,
    });

    expect(adapter.fetchMatches).toHaveBeenCalledWith(
      expect.objectContaining({ revealPersonalEmails: true }),
    );
  });
});

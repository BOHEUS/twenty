import { type CoreApiClient } from 'twenty-client-sdk/core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  LUSHA_API_KEY_MISSING_MESSAGE,
  LUSHA_COMPLIANCE_RESTRICTED_MESSAGE,
} from 'src/constants/enrichment-messages.constant';
import { type EnrichmentAdapter } from 'src/logic-functions/types/enrichment-adapter.type';
import { type LushaApiResult } from 'src/logic-functions/types/lusha-api-result.type';
import { type LushaRecord } from 'src/logic-functions/types/lusha-record.type';
import { runBulkEnrichment } from 'src/logic-functions/utils/run-bulk-enrichment';

type FakeRecord = { id: string; domain?: string };

type FakeSearchItem = { clientReferenceId: string; domain: string };

const client = {} as CoreApiClient;

const createAdapter = ({
  records,
  searchAndEnrich = ({ items }) =>
    Promise.resolve({
      success: true,
      data: items.map(({ clientReferenceId, domain }) => ({
        clientReferenceId,
        id: `lusha-${domain}`,
      })),
    }),
}: {
  records: FakeRecord[];
  searchAndEnrich?: (args: {
    items: FakeSearchItem[];
  }) => Promise<LushaApiResult<LushaRecord[]>>;
}) =>
  ({
    objectNameSingular: 'Company',
    noIdentifierMessage: 'Company has no domain.',
    notFoundMessage: 'Lusha has no company matching this domain.',
    fieldNamesDroppableOnWriteFailure: ['domainName'],
    readRecords: vi.fn(({ recordIds }: { recordIds: string[] }) =>
      Promise.resolve(records.filter(({ id }) => recordIds.includes(id))),
    ),
    buildSearchItem: (record: FakeRecord) =>
      record.domain === undefined
        ? undefined
        : { clientReferenceId: record.id, domain: record.domain },
    searchAndEnrich: vi.fn(searchAndEnrich),
    buildUpdateData: vi.fn(
      ({ match, enrichedAt }: { match: LushaRecord; enrichedAt: string }) =>
        Promise.resolve({
          domainName: { primaryLinkUrl: 'lusha.com' },
          lushaId: match.id,
          lushaLastEnrichedAt: enrichedAt,
          lushaEnrichmentStatus: 'ENRICHED',
        }),
    ),
    updateRecord: vi.fn(
      (_args: { recordId: string; data: Record<string, unknown> }) =>
        Promise.resolve(),
    ),
    updateManyStatus: vi.fn(
      (_args: { recordIds: string[]; data: Record<string, unknown> }) =>
        Promise.resolve(),
    ),
  }) satisfies EnrichmentAdapter<FakeRecord, FakeSearchItem>;

beforeEach(() => {
  vi.stubEnv('LUSHA_API_KEY', 'lusha-api-key');
  vi.stubEnv('LUSHA_REVEAL_PHONES', '');
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('runBulkEnrichment', () => {
  it('should write the data Lusha returned for every matched record', async () => {
    const adapter = createAdapter({
      records: [
        { id: 'company-1', domain: 'lusha.com' },
        { id: 'company-2', domain: 'twenty.com' },
      ],
    });

    const result = await runBulkEnrichment({
      input: { records: [{ id: 'company-1' }, { id: 'company-2' }] },
      adapter,
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
    expect(adapter.updateRecord).toHaveBeenCalledWith(
      expect.objectContaining({
        recordId: 'company-2',
        data: expect.objectContaining({ lushaId: 'lusha-twenty.com' }),
      }),
    );
    expect(result.results[0]).toEqual({
      success: true,
      recordId: 'company-1',
      status: 'ENRICHED',
      updatedFields: ['domainName', 'lushaId'],
      message: 'Enriched company from Lusha.',
    });
  });

  it('should send the record id as the reference Lusha echoes back', async () => {
    const adapter = createAdapter({
      records: [{ id: 'company-1', domain: 'lusha.com' }],
    });

    await runBulkEnrichment({
      input: { records: ['company-1'] },
      adapter,
      client,
    });

    expect(adapter.searchAndEnrich).toHaveBeenCalledWith(
      expect.objectContaining({
        apiKey: 'lusha-api-key',
        items: [{ clientReferenceId: 'company-1', domain: 'lusha.com' }],
      }),
    );
  });

  it('should fail every record without calling Lusha when no API key is set', async () => {
    vi.stubEnv('LUSHA_API_KEY', ' ');
    const adapter = createAdapter({
      records: [{ id: 'company-1', domain: 'lusha.com' }],
    });

    const result = await runBulkEnrichment({
      input: { records: ['company-1'] },
      adapter,
      client,
    });

    expect(result).toMatchObject({ success: false, total: 1, errored: 1 });
    expect(result.results[0].message).toBe(LUSHA_API_KEY_MISSING_MESSAGE);
    expect(adapter.readRecords).not.toHaveBeenCalled();
    expect(adapter.updateManyStatus).not.toHaveBeenCalled();
  });

  it('should skip records Lusha cannot match without sending them', async () => {
    const adapter = createAdapter({
      records: [{ id: 'company-1' }, { id: 'company-2', domain: 'lusha.com' }],
    });

    const result = await runBulkEnrichment({
      input: { records: ['company-1', 'company-2'] },
      adapter,
      client,
    });

    expect(result).toMatchObject({ success: true, skipped: 1, enriched: 1 });
    expect(result.results[0]).toMatchObject({
      recordId: 'company-1',
      status: 'SKIPPED',
      message: 'Company has no domain.',
    });
    expect(
      vi.mocked(adapter.searchAndEnrich).mock.calls[0][0].items,
    ).toHaveLength(1);
  });

  it('should report an id that matches no record', async () => {
    const adapter = createAdapter({ records: [] });

    const result = await runBulkEnrichment({
      input: { records: ['company-1'] },
      adapter,
      client,
    });

    expect(result).toMatchObject({ success: false, errored: 1 });
    expect(result.results[0].message).toBe('Company company-1 was not found.');
    expect(adapter.searchAndEnrich).not.toHaveBeenCalled();
  });

  it('should mark records Lusha returned nothing for as not found', async () => {
    const adapter = createAdapter({
      records: [
        { id: 'company-1', domain: 'unknown.io' },
        { id: 'company-2', domain: 'private.io' },
      ],
      searchAndEnrich: () =>
        Promise.resolve({
          success: true,
          data: [
            {
              clientReferenceId: 'company-2',
              error: { code: 'COMPLIANCE_RESTRICTED', message: 'Restricted' },
            },
          ],
        }),
    });

    const result = await runBulkEnrichment({
      input: { records: ['company-1', 'company-2'] },
      adapter,
      client,
    });

    expect(result).toMatchObject({ success: true, notFound: 2, enriched: 0 });
    expect(result.results.map(({ message }) => message)).toEqual([
      'Lusha has no company matching this domain.',
      LUSHA_COMPLIANCE_RESTRICTED_MESSAGE,
    ]);
    expect(adapter.updateManyStatus).toHaveBeenCalledWith(
      expect.objectContaining({
        recordIds: ['company-1', 'company-2'],
        data: expect.objectContaining({ lushaEnrichmentStatus: 'NOT_FOUND' }),
      }),
    );
    expect(adapter.updateRecord).not.toHaveBeenCalled();
  });

  it('should report a record Lusha failed to enrich', async () => {
    const adapter = createAdapter({
      records: [{ id: 'company-1', domain: 'lusha.com' }],
      searchAndEnrich: () =>
        Promise.resolve({
          success: true,
          data: [
            {
              clientReferenceId: 'company-1',
              error: { code: 'ENRICH_FAILED', message: 'Enrichment failed' },
            },
          ],
        }),
    });

    const result = await runBulkEnrichment({
      input: { records: ['company-1'] },
      adapter,
      client,
    });

    expect(result).toMatchObject({ success: false, errored: 1 });
    expect(result.results[0].message).toBe('Enrichment failed');
    expect(adapter.updateManyStatus).toHaveBeenCalledWith(
      expect.objectContaining({
        recordIds: ['company-1'],
        data: expect.objectContaining({ lushaEnrichmentStatus: 'ERROR' }),
      }),
    );
  });

  it('should fail every record of a batch Lusha refused and write the error status', async () => {
    const adapter = createAdapter({
      records: [{ id: 'company-1', domain: 'lusha.com' }],
      searchAndEnrich: () =>
        Promise.resolve({
          success: false,
          error: 'Lusha request failed (HTTP 400): Invalid request parameters',
          isAccountFailure: false,
        }),
    });

    const result = await runBulkEnrichment({
      input: { records: ['company-1'] },
      adapter,
      client,
    });

    expect(result).toMatchObject({ success: false, errored: 1 });
    expect(result.results[0].message).toBe(
      'Lusha request failed (HTTP 400): Invalid request parameters',
    );
    expect(adapter.updateManyStatus).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ lushaEnrichmentStatus: 'ERROR' }),
      }),
    );
  });

  it('should stop sending batches once Lusha refuses the account', async () => {
    const records = Array.from({ length: 150 }, (_, index) => ({
      id: `company-${index}`,
      domain: `company-${index}.com`,
    }));
    const adapter = createAdapter({
      records,
      searchAndEnrich: () =>
        Promise.resolve({
          success: false,
          error: 'The Lusha account has run out of credits.',
          isAccountFailure: true,
        }),
    });

    const result = await runBulkEnrichment({
      input: { records: records.map(({ id }) => id) },
      adapter,
      client,
    });

    expect(adapter.searchAndEnrich).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject({ success: false, total: 150, errored: 150 });
    expect(result.results[149].message).toBe(
      'Not sent to Lusha because an earlier request failed: The Lusha account has run out of credits.',
    );
    expect(adapter.updateManyStatus).toHaveBeenCalledTimes(1);
  });

  it('should retry a refused write without the fields the server can reject', async () => {
    const adapter = createAdapter({
      records: [{ id: 'company-1', domain: 'lusha.com' }],
    });
    adapter.updateRecord
      .mockRejectedValueOnce(new Error('A duplicate entry was detected'))
      .mockResolvedValueOnce(undefined);

    const result = await runBulkEnrichment({
      input: { records: ['company-1'] },
      adapter,
      client,
    });

    expect(result.results[0]).toEqual({
      success: true,
      recordId: 'company-1',
      status: 'ENRICHED',
      updatedFields: ['lushaId'],
      message:
        'Enriched company from Lusha, but could not save domainName: A duplicate entry was detected',
    });
    expect(vi.mocked(adapter.updateRecord).mock.calls[1][0]).toMatchObject({
      data: { lushaId: 'lusha-lusha.com' },
    });
  });

  it('should report a record whose write failed twice and enrich the others', async () => {
    const adapter = createAdapter({
      records: [
        { id: 'company-1', domain: 'lusha.com' },
        { id: 'company-2', domain: 'twenty.com' },
      ],
    });
    adapter.updateRecord.mockImplementation(
      ({ recordId }: { recordId: string }) =>
        recordId === 'company-1'
          ? Promise.reject(new Error('Record is read only'))
          : Promise.resolve(),
    );

    const result = await runBulkEnrichment({
      input: { records: ['company-1', 'company-2'] },
      adapter,
      client,
    });

    expect(result).toMatchObject({ success: false, enriched: 1, errored: 1 });
    expect(result.results[0]).toMatchObject({
      recordId: 'company-1',
      status: 'ERROR',
      message: 'Record is read only',
    });
    expect(adapter.updateManyStatus).toHaveBeenCalledWith(
      expect.objectContaining({
        recordIds: ['company-1'],
        data: expect.objectContaining({ lushaEnrichmentStatus: 'ERROR' }),
      }),
    );
  });

  it('should read records 200 at a time and send them to Lusha 100 at a time', async () => {
    const records = Array.from({ length: 250 }, (_, index) => ({
      id: `company-${index}`,
      domain: `company-${index}.com`,
    }));
    const adapter = createAdapter({ records });

    const result = await runBulkEnrichment({
      input: { records: records.map(({ id }) => id) },
      adapter,
      client,
    });

    expect(result).toMatchObject({ total: 250, enriched: 250 });
    expect(
      vi
        .mocked(adapter.readRecords)
        .mock.calls.map(([{ recordIds }]) => recordIds.length),
    ).toEqual([200, 50]);
    expect(
      vi
        .mocked(adapter.searchAndEnrich)
        .mock.calls.map(([{ items }]) => items.length),
    ).toEqual([100, 100, 50]);
  });

  it('should reveal phone numbers when the app setting asks for it', async () => {
    vi.stubEnv('LUSHA_REVEAL_PHONES', 'true');
    const adapter = createAdapter({
      records: [{ id: 'company-1', domain: 'lusha.com' }],
    });

    await runBulkEnrichment({
      input: { records: ['company-1'] },
      adapter,
      client,
    });

    expect(adapter.searchAndEnrich).toHaveBeenCalledWith(
      expect.objectContaining({ revealPhones: true }),
    );
  });

  it('should let the input override the phone reveal setting', async () => {
    vi.stubEnv('LUSHA_REVEAL_PHONES', 'true');
    const adapter = createAdapter({
      records: [{ id: 'company-1', domain: 'lusha.com' }],
    });

    await runBulkEnrichment({
      input: { records: ['company-1'], revealPhones: false },
      adapter,
      client,
    });

    expect(adapter.searchAndEnrich).toHaveBeenCalledWith(
      expect.objectContaining({ revealPhones: false }),
    );
  });
});

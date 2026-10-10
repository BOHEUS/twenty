import { describe, expect, it, vi } from 'vitest';
import { type CoreApiClient } from 'twenty-client-sdk/core';

import { DROPCONTACT_ACCESS_ERROR_MESSAGE } from 'src/constants/dropcontact-access-error-message';
import { UPDATE_FIELDS_OPTIONS } from 'src/constants/update-fields-options';
import { DropcontactConfigError } from 'src/logic-functions/errors/dropcontact-config-error';
import { runBatchEnrichment } from 'src/logic-functions/utils/run-batch-enrichment';
import { type BatchEnrichmentAdapter } from 'src/types/batch-enrichment-adapter';
import { type DropcontactEnrichResult } from 'src/types/dropcontact-enrich-result';

type FakeNode = {
  id: string;
  hasIdentifier: boolean;
};
type FakeData = { id: string };
type FakeParams = { id: string };

type BuildMatchedDataArgs = Parameters<
  BatchEnrichmentAdapter<FakeNode, FakeData, FakeParams>['buildMatchedData']
>[0];

type RecordConfig = {
  id: string;
  exists?: boolean;
  hasIdentifier?: boolean;
  outcome?: DropcontactEnrichResult<FakeData>;
  updateFails?: boolean;
  buildFails?: boolean;
};

const CLIENT = {} as CoreApiClient;

const buildHarness = (configs: RecordConfig[]) => {
  const byId = new Map(configs.map((config) => [config.id, config]));

  const readRecords = vi.fn(
    async ({
      recordIds,
    }: {
      client: CoreApiClient;
      recordIds: string[];
    }): Promise<FakeNode[]> =>
      recordIds
        .map((id) => byId.get(id))
        .filter(
          (config): config is RecordConfig =>
            isPresent(config) && config.exists !== false,
        )
        .map((config) => ({
          id: config.id,
          hasIdentifier: config.hasIdentifier !== false,
        })),
  );

  const enrichBatch = vi.fn(
    async (
      params: FakeParams[],
    ): Promise<DropcontactEnrichResult<FakeData>[]> =>
      params.map(
        (param) =>
          byId.get(param.id)?.outcome ?? {
            outcome: 'matched',
            data: { id: param.id },
          },
      ),
  );

  const updateOne = vi.fn(
    async ({
      recordId,
    }: {
      client: CoreApiClient;
      recordId: string;
      data: Record<string, unknown>;
    }) => {
      if (byId.get(recordId)?.updateFails === true) {
        throw new Error('update failed');
      }
    },
  );

  const updateManyStatus = vi.fn(async () => undefined);

  const extractParams = vi.fn(({ node }: { node: FakeNode }) =>
    node.hasIdentifier ? { id: node.id } : undefined,
  );

  const buildMatchedData = vi.fn(
    async ({
      node,
    }: BuildMatchedDataArgs): Promise<{
      mappedData: Record<string, unknown>;
      persistData: Record<string, unknown>;
    }> => {
      if (byId.get(node.id)?.buildFails === true) {
        throw new Error('build failed');
      }

      return {
        mappedData: { mapped: node.id },
        persistData: { value: node.id },
      };
    },
  );

  const adapter: BatchEnrichmentAdapter<FakeNode, FakeData, FakeParams> = {
    objectNameSingular: 'Test',
    noIdentifierMessage: 'no identifier',
    readRecords,
    getNodeId: (node) => node.id,
    extractParams,
    enrichBatch,
    buildMatchedData,
    updateOne,
    updateManyStatus,
  };

  return {
    adapter,
    readRecords,
    extractParams,
    enrichBatch,
    updateOne,
    updateManyStatus,
    buildMatchedData,
  };
};

const isPresent = <TValue>(value: TValue | undefined): value is TValue =>
  value !== undefined;

const records = (...ids: string[]) => ids.map((id) => ({ id }));

const buildRecordIds = (count: number) =>
  Array.from({ length: count }, (_unused, index) => `r${index}`);

const INVALID_API_KEY_OUTCOME: DropcontactEnrichResult<FakeData> = {
  outcome: 'error',
  httpStatus: 401,
  message: 'Invalid API key',
};

describe('runBatchEnrichment', () => {
  it('reads every id in one call and enriches the set in one batch', async () => {
    const harness = buildHarness([{ id: 'a' }, { id: 'b' }]);

    const result = await runBatchEnrichment({
      client: CLIENT,
      input: { records: records('a', 'b') },
      adapter: harness.adapter,
    });

    expect(harness.readRecords).toHaveBeenCalledTimes(1);
    expect(harness.readRecords).toHaveBeenCalledWith({
      client: CLIENT,
      recordIds: ['a', 'b'],
    });
    expect(harness.enrichBatch).toHaveBeenCalledTimes(1);
    expect(harness.enrichBatch).toHaveBeenCalledWith(
      [{ id: 'a' }, { id: 'b' }],
      { deadline: expect.any(Number) },
    );
    expect(harness.updateOne).toHaveBeenCalledTimes(2);
    expect(result).toMatchObject({
      total: 2,
      matched: 2,
      errored: 0,
      success: true,
    });
  });

  it('writes NOT_FOUND and ERROR statuses with batched status updates', async () => {
    const harness = buildHarness([
      { id: 'a', outcome: { outcome: 'not_found' } },
      { id: 'b', outcome: { outcome: 'not_found' } },
      {
        id: 'c',
        outcome: { outcome: 'error', httpStatus: 500, message: 'boom' },
      },
    ]);

    const result = await runBatchEnrichment({
      client: CLIENT,
      input: { records: records('a', 'b', 'c') },
      adapter: harness.adapter,
    });

    expect(harness.updateOne).not.toHaveBeenCalled();
    expect(harness.updateManyStatus).toHaveBeenCalledWith({
      client: CLIENT,
      recordIds: ['c'],
      data: {
        dropcontactEnrichmentStatus: 'ERROR',
        dropcontactLastEnrichedAt: expect.any(String),
      },
    });
    expect(harness.updateManyStatus).toHaveBeenCalledWith({
      client: CLIENT,
      recordIds: ['a', 'b'],
      data: {
        dropcontactEnrichmentStatus: 'NOT_FOUND',
        dropcontactLastEnrichedAt: expect.any(String),
        dropcontactRequestId: null,
      },
    });
    expect(result).toMatchObject({ notFound: 2, errored: 1, matched: 0 });
    expect(result.results.find((entry) => entry.recordId === 'c')?.error).toBe(
      'boom',
    );
  });

  it('skips no-identifier records before the Dropcontact call', async () => {
    const harness = buildHarness([
      { id: 'a', hasIdentifier: false },
      { id: 'b' },
    ]);

    const result = await runBatchEnrichment({
      client: CLIENT,
      input: { records: records('a', 'b') },
      adapter: harness.adapter,
    });

    expect(harness.enrichBatch).toHaveBeenCalledWith([{ id: 'b' }], {
      deadline: expect.any(Number),
    });
    expect(result).toMatchObject({ skipped: 1, matched: 1 });
  });

  it('maps "Yes and overwrite" to overrideExistingValues and persisting', async () => {
    const harness = buildHarness([{ id: 'a' }]);

    await runBatchEnrichment({
      client: CLIENT,
      input: {
        records: records('a'),
        updateFields: UPDATE_FIELDS_OPTIONS.overwrite,
      },
      adapter: harness.adapter,
    });

    expect(harness.buildMatchedData).toHaveBeenCalledWith(
      expect.objectContaining({
        overrideExistingValues: true,
        shouldPersist: true,
      }),
    );
  });

  it('defaults to fill-empty persisting when updateFields is omitted', async () => {
    const harness = buildHarness([{ id: 'a' }]);

    await runBatchEnrichment({
      client: CLIENT,
      input: { records: records('a') },
      adapter: harness.adapter,
    });

    expect(harness.buildMatchedData).toHaveBeenCalledWith(
      expect.objectContaining({
        overrideExistingValues: false,
        shouldPersist: true,
      }),
    );
  });

  it('returns mapped data without writing anything when updateFields is "No"', async () => {
    const harness = buildHarness([
      { id: 'a' },
      { id: 'b', outcome: { outcome: 'not_found' } },
    ]);

    const result = await runBatchEnrichment({
      client: CLIENT,
      input: {
        records: records('a', 'b'),
        updateFields: UPDATE_FIELDS_OPTIONS.no,
      },
      adapter: harness.adapter,
    });

    expect(harness.buildMatchedData).toHaveBeenCalledWith(
      expect.objectContaining({ shouldPersist: false }),
    );
    expect(harness.updateOne).not.toHaveBeenCalled();
    expect(harness.updateManyStatus).not.toHaveBeenCalled();

    const matched = result.results.find((entry) => entry.recordId === 'a');
    expect(matched?.status).toBe('MATCHED');
    expect(matched?.updatedFields).toEqual([]);
    expect(matched?.data).toEqual({ mapped: 'a' });
    expect(result).toMatchObject({ matched: 1, notFound: 1 });
  });

  it('marks missing records as ERROR without enriching them', async () => {
    const harness = buildHarness([{ id: 'a' }, { id: 'b', exists: false }]);

    const result = await runBatchEnrichment({
      client: CLIENT,
      input: { records: records('a', 'b') },
      adapter: harness.adapter,
    });

    expect(harness.enrichBatch).toHaveBeenCalledWith([{ id: 'a' }], {
      deadline: expect.any(Number),
    });
    expect(
      result.results.find((entry) => entry.recordId === 'b'),
    ).toMatchObject({
      status: 'ERROR',
      error: 'Test b not found',
    });
    expect(result).toMatchObject({ matched: 1, errored: 1 });
  });

  it('isolates a per-record matched update failure', async () => {
    const harness = buildHarness([{ id: 'a' }, { id: 'b', updateFails: true }]);

    const result = await runBatchEnrichment({
      client: CLIENT,
      input: { records: records('a', 'b') },
      adapter: harness.adapter,
    });

    expect(result.results.find((entry) => entry.recordId === 'a')?.status).toBe(
      'MATCHED',
    );
    expect(
      result.results.find((entry) => entry.recordId === 'b'),
    ).toMatchObject({
      status: 'ERROR',
      error: 'update failed',
    });
    expect(harness.updateManyStatus).toHaveBeenCalledWith({
      client: CLIENT,
      recordIds: ['b'],
      data: {
        dropcontactEnrichmentStatus: 'ERROR',
        dropcontactLastEnrichedAt: expect.any(String),
        dropcontactRequestId: null,
      },
    });
  });

  it('marks all attempted records as ERROR and writes the status when the batch Dropcontact call rejects', async () => {
    const harness = buildHarness([{ id: 'a' }, { id: 'b' }]);
    harness.enrichBatch.mockRejectedValueOnce(new Error('dropcontact down'));

    const result = await runBatchEnrichment({
      client: CLIENT,
      input: { records: records('a', 'b') },
      adapter: harness.adapter,
    });

    expect(result).toMatchObject({ errored: 2, matched: 0 });
    expect(result.results[0].error).toBe('dropcontact down');
    expect(harness.updateOne).not.toHaveBeenCalled();
    expect(harness.updateManyStatus).toHaveBeenCalledWith({
      client: CLIENT,
      recordIds: ['a', 'b'],
      data: {
        dropcontactEnrichmentStatus: 'ERROR',
        dropcontactLastEnrichedAt: expect.any(String),
      },
    });
  });

  it('isolates a record whose matched-data build throws', async () => {
    const harness = buildHarness([{ id: 'a' }, { id: 'b', buildFails: true }]);

    const result = await runBatchEnrichment({
      client: CLIENT,
      input: { records: records('a', 'b') },
      adapter: harness.adapter,
    });

    expect(result.results.find((entry) => entry.recordId === 'a')?.status).toBe(
      'MATCHED',
    );
    expect(
      result.results.find((entry) => entry.recordId === 'b'),
    ).toMatchObject({
      status: 'ERROR',
      error: 'build failed',
    });
    expect(harness.updateOne).toHaveBeenCalledTimes(1);
    expect(harness.updateManyStatus).toHaveBeenCalledWith({
      client: CLIENT,
      recordIds: ['b'],
      data: {
        dropcontactEnrichmentStatus: 'ERROR',
        dropcontactLastEnrichedAt: expect.any(String),
        dropcontactRequestId: null,
      },
    });
  });

  it('produces exactly one result per record with counts summing to the total', async () => {
    const harness = buildHarness([
      { id: 'matched' },
      { id: 'notfound', outcome: { outcome: 'not_found' } },
      {
        id: 'errored',
        outcome: { outcome: 'error', httpStatus: 500, message: 'x' },
      },
      { id: 'skipped', hasIdentifier: false },
      { id: 'missing', exists: false },
    ]);

    const result = await runBatchEnrichment({
      client: CLIENT,
      input: {
        records: records(
          'matched',
          'notfound',
          'errored',
          'skipped',
          'missing',
        ),
      },
      adapter: harness.adapter,
    });

    const recordIds = result.results.map((entry) => entry.recordId);
    expect(new Set(recordIds).size).toBe(recordIds.length);
    expect(result.results).toHaveLength(result.total);
    expect(
      result.matched + result.notFound + result.skipped + result.errored,
    ).toBe(result.total);
    expect(result).toMatchObject({
      total: 5,
      matched: 1,
      notFound: 1,
      errored: 2,
      skipped: 1,
      success: false,
    });
  });

  it('deduplicates record ids', async () => {
    const harness = buildHarness([{ id: 'a' }]);

    const result = await runBatchEnrichment({
      client: CLIENT,
      input: { records: records('a', 'a') },
      adapter: harness.adapter,
    });

    expect(harness.enrichBatch).toHaveBeenCalledWith([{ id: 'a' }], {
      deadline: expect.any(Number),
    });
    expect(result.total).toBe(1);
  });

  it('chunks large id sets into separate read and Dropcontact calls', async () => {
    const ids = buildRecordIds(300);
    const harness = buildHarness(ids.map((id) => ({ id })));

    const result = await runBatchEnrichment({
      client: CLIENT,
      input: { records: ids.map((id) => ({ id })) },
      adapter: harness.adapter,
    });

    expect(harness.readRecords).toHaveBeenCalledTimes(2);
    expect(harness.enrichBatch).toHaveBeenCalledTimes(2);
    expect(result.matched).toBe(300);
  });

  it('stops enriching the remaining chunks when Dropcontact rejects the API key', async () => {
    const ids = buildRecordIds(300);
    const harness = buildHarness(
      ids.map((id) => ({ id, outcome: INVALID_API_KEY_OUTCOME })),
    );

    const result = await runBatchEnrichment({
      client: CLIENT,
      input: { records: ids.map((id) => ({ id })) },
      adapter: harness.adapter,
    });

    expect(harness.readRecords).toHaveBeenCalledTimes(1);
    expect(harness.enrichBatch).toHaveBeenCalledTimes(1);
    expect(harness.updateManyStatus).toHaveBeenCalledExactlyOnceWith({
      client: CLIENT,
      recordIds: ids.slice(0, 250),
      data: {
        dropcontactEnrichmentStatus: 'ERROR',
        dropcontactLastEnrichedAt: expect.any(String),
      },
    });
    expect(result).toMatchObject({ total: 300, errored: 300, success: false });
    expect(result.results[0]).toMatchObject({
      recordId: 'r0',
      status: 'ERROR',
      error: DROPCONTACT_ACCESS_ERROR_MESSAGE,
    });
    expect(result.results[299]).toMatchObject({
      recordId: 'r299',
      status: 'ERROR',
      error: DROPCONTACT_ACCESS_ERROR_MESSAGE,
    });
  });

  it('stops enriching the remaining chunks when the API key is not configured', async () => {
    const ids = buildRecordIds(300);
    const harness = buildHarness(ids.map((id) => ({ id })));
    harness.enrichBatch.mockRejectedValue(
      new DropcontactConfigError('DROPCONTACT_API_KEY is not set.'),
    );

    const result = await runBatchEnrichment({
      client: CLIENT,
      input: { records: ids.map((id) => ({ id })) },
      adapter: harness.adapter,
    });

    expect(harness.enrichBatch).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject({ total: 300, errored: 300 });
    expect(result.results[0].error).toBe(DROPCONTACT_ACCESS_ERROR_MESSAGE);
    expect(result.results[299].error).toBe(DROPCONTACT_ACCESS_ERROR_MESSAGE);
  });

  it('keeps enriching the remaining chunks after a chunk fails for another reason', async () => {
    const ids = buildRecordIds(300);
    const harness = buildHarness(ids.map((id) => ({ id })));
    harness.enrichBatch.mockRejectedValueOnce(new Error('dropcontact down'));

    const result = await runBatchEnrichment({
      client: CLIENT,
      input: { records: ids.map((id) => ({ id })) },
      adapter: harness.adapter,
    });

    expect(harness.enrichBatch).toHaveBeenCalledTimes(2);
    expect(result).toMatchObject({ matched: 50, errored: 250 });
  });

  it('returns an empty summary when there are no records', async () => {
    const harness = buildHarness([]);

    const result = await runBatchEnrichment({
      client: CLIENT,
      input: { records: [] },
      adapter: harness.adapter,
    });

    expect(harness.readRecords).not.toHaveBeenCalled();
    expect(result).toEqual({
      success: true,
      total: 0,
      matched: 0,
      pending: 0,
      notFound: 0,
      skipped: 0,
      errored: 0,
      results: [],
    });
  });
});

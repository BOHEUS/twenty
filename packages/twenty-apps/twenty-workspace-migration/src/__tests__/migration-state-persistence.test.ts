import { beforeEach, describe, expect, it, vi } from 'vitest';

const store = vi.hoisted(() => new Map<string, unknown>());
const kvMock = vi.hoisted(() => ({
  get: vi.fn(async (key: string) => (store.has(key) ? structuredClone(store.get(key)) : null)),
  set: vi.fn(async (key: string, value: unknown) => {
    store.set(key, JSON.parse(JSON.stringify(value)));
  }),
  delete: vi.fn(async (key: string) => store.delete(key)),
}));

vi.mock('twenty-sdk/logic-function', () => ({ kv: kvMock }));

import {
  clearMigrationState,
  loadMigrationStateCheckpoint,
  migrationState,
  readMigrationStatusSnapshot,
  saveMigrationStateCheckpoint,
} from 'src/logic-functions/utils/migration-state.util';
import {
  acquireRunLock,
  isRunLockActive,
  markRunHandedOff,
  releaseRunLockUnlessHandedOff,
} from 'src/logic-functions/utils/run-lock.util';

const buildIds = (count: number, prefix = 'record'): string[] =>
  Array.from({ length: count }, (_, index) => `${prefix}-${index}`);

beforeEach(async () => {
  store.clear();
  await loadMigrationStateCheckpoint();
  vi.clearAllMocks();
});

describe('run lock', () => {
  it('refuses a second start while a run holds the lock, but lets that run continue', async () => {
    expect(await acquireRunLock(undefined)).toBe(true);
    const runId = (store.get('migrationRunLock') as { runId: string }).runId;

    expect(await acquireRunLock(undefined)).toBe(false);
    expect(await acquireRunLock('some-other-run')).toBe(false);
    expect(await acquireRunLock(runId)).toBe(true);
  });

  it('lets a new run start once the lock has expired', async () => {
    store.set('migrationRunLock', { runId: 'dead-run', expiresAt: Date.now() - 1 });

    expect(await isRunLockActive()).toBe(false);
    expect(await acquireRunLock(undefined)).toBe(true);
  });

  it('keeps the lock for the next invocation after a hand-off and releases it otherwise', async () => {
    await acquireRunLock(undefined);
    markRunHandedOff();
    await releaseRunLockUnlessHandedOff();
    expect(await isRunLockActive()).toBe(true);

    await acquireRunLock((store.get('migrationRunLock') as { runId: string }).runId);
    await releaseRunLockUnlessHandedOff();
    expect(await isRunLockActive()).toBe(false);
  });
});

describe('migration state checkpoint', () => {
  it('round-trips migrated record ids across chunk boundaries', async () => {
    const ids = buildIds(120_000);
    migrationState.migratedRecordIds = new Set(ids);
    migrationState.stage = 3;
    await saveMigrationStateCheckpoint();

    migrationState.migratedRecordIds = new Set();
    migrationState.stage = 1;
    await loadMigrationStateCheckpoint();

    expect(migrationState.stage).toBe(3);
    expect([...migrationState.migratedRecordIds]).toEqual(ids);
    expect(JSON.stringify(store.get('migrationState'))).not.toContain('record-0');
  });

  it('only rewrites the chunks that gained ids since the last checkpoint', async () => {
    migrationState.migratedRecordIds = new Set(buildIds(120_000));
    await saveMigrationStateCheckpoint();
    kvMock.set.mockClear();

    migrationState.migratedRecordIds.add('record-new');
    await saveMigrationStateCheckpoint();

    const writtenChunkKeys = kvMock.set.mock.calls.map(([key]) => key).filter((key) => key.startsWith('migratedRecordIds:'));
    expect(writtenChunkKeys).toEqual(['migratedRecordIds:2']);
  });

  it('serves the status page from its own key, with whether a run is live', async () => {
    migrationState.stage = 4;
    migrationState.migratedRecordIds = new Set(buildIds(10));
    await saveMigrationStateCheckpoint();
    await acquireRunLock(undefined);
    kvMock.get.mockClear();

    const snapshot = await readMigrationStatusSnapshot();

    expect(snapshot).toMatchObject({ stage: 4, isRunning: true });
    expect(kvMock.get.mock.calls.map(([key]) => key).sort()).toEqual(['migrationRunLock', 'migrationStatus']);
  });

  it('clears every saved key and starts the next load from a fresh state', async () => {
    migrationState.stage = 9;
    migrationState.migratedRecordIds = new Set(buildIds(60_000));
    await saveMigrationStateCheckpoint();

    await clearMigrationState();
    await loadMigrationStateCheckpoint();

    expect(store.size).toBe(0);
    expect(migrationState.stage).toBe(1);
    expect(migrationState.migratedRecordIds.size).toBe(0);
  });
});

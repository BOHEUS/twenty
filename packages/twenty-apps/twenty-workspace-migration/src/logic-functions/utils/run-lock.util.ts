import { kv } from 'twenty-sdk/logic-function';
import { TIMEOUT_SECONDS } from "src/constants/timeout-seconds";

const RUN_LOCK_KV_KEY = 'migrationRunLock';

type RunLock = {
  runId: string;
  expiresAt: number;
};

// A migration is a chain of invocations, each triggering the next with the chain's run id, so
// only a holder of that id may continue while the lock is live. It expires on its own once an
// invocation could no longer be running, so a chain killed by the platform doesn't block
// future runs forever. kv has no compare-and-set: two starts landing within the same few
// milliseconds can still both get through.
let currentRunId: string | null = null;
let isHandedOff = false;

const isLive = (lock: RunLock | null): lock is RunLock =>
  lock !== null && lock.expiresAt > Date.now();

export const acquireRunLock = async (continuationRunId: string | undefined): Promise<boolean> => {
  const lock = await kv.get<RunLock>(RUN_LOCK_KV_KEY);
  if (isLive(lock) && lock.runId !== continuationRunId) {
    return false;
  }

  currentRunId = continuationRunId ?? crypto.randomUUID();
  isHandedOff = false;
  await kv.set<RunLock>(RUN_LOCK_KV_KEY, {
    runId: currentRunId,
    expiresAt: Date.now() + TIMEOUT_SECONDS * 1000,
  });
  return true;
};

export const getCurrentRunId = (): string | null => currentRunId;

// The next invocation renews the lock under the same run id, so this one must not release it.
export const markRunHandedOff = (): void => {
  isHandedOff = true;
};

export const releaseRunLockUnlessHandedOff = async (): Promise<void> => {
  if (isHandedOff) {
    return;
  }
  await kv.delete(RUN_LOCK_KV_KEY);
};

export const isRunLockActive = async (): Promise<boolean> =>
  isLive(await kv.get<RunLock>(RUN_LOCK_KV_KEY));

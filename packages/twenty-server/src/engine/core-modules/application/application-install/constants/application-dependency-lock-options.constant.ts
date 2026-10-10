import { type CacheLockOptions } from 'src/engine/core-modules/cache-lock/cache-lock.service';

// A waiter may sit behind a whole install, upgrade or uninstall of another
// application of the workspace, so it waits longer than the per-application lock.
export const APPLICATION_DEPENDENCY_LOCK_OPTIONS: CacheLockOptions = {
  ttl: 60_000,
  ms: 500,
  maxRetries: 600,
};

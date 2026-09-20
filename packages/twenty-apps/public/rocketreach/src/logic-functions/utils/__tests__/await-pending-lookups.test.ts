import { afterEach, describe, expect, it, vi } from 'vitest';

import { LOOKUP_POLL_MAX_ATTEMPTS } from 'src/constants/lookup-polling';
import { awaitPendingLookups } from 'src/logic-functions/utils/await-pending-lookups';
import { checkPersonLookupStatus } from 'src/logic-functions/utils/check-person-lookup-status';
import { type RocketReachLookupResult } from 'src/types/rocketreach-lookup-result';
import { type RocketReachPersonData } from 'src/types/rocketreach-person-data';

vi.mock('src/logic-functions/utils/check-person-lookup-status', () => ({
  checkPersonLookupStatus: vi.fn(),
}));

vi.mock('src/logic-functions/utils/sleep', () => ({
  sleep: () => Promise.resolve(),
}));

const checkPersonLookupStatusMock = vi.mocked(checkPersonLookupStatus);

const pending = (
  profileId: number,
): RocketReachLookupResult<RocketReachPersonData> => ({
  outcome: 'pending',
  httpStatus: 200,
  profileId,
  data: { id: profileId, status: 'progress' },
});

const matched = (
  profileId: number,
): RocketReachLookupResult<RocketReachPersonData> => ({
  outcome: 'matched',
  httpStatus: 200,
  data: { id: profileId, status: 'complete' },
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('awaitPendingLookups', () => {
  it('leaves settled results untouched and polls nothing', async () => {
    const results = [matched(1), { outcome: 'not_found', httpStatus: 404 } as const];

    expect(await awaitPendingLookups([...results])).toEqual(results);
    expect(checkPersonLookupStatusMock).not.toHaveBeenCalled();
  });

  it('replaces a pending result once the lookup completes', async () => {
    checkPersonLookupStatusMock.mockResolvedValueOnce(
      new Map([[42, matched(42)]]),
    );

    const settled = await awaitPendingLookups([matched(1), pending(42)]);

    expect(settled[1]).toEqual(matched(42));
    expect(checkPersonLookupStatusMock).toHaveBeenCalledTimes(1);
  });

  it('stops polling after the attempt budget and stays pending', async () => {
    checkPersonLookupStatusMock.mockResolvedValue(new Map([[42, pending(42)]]));

    const settled = await awaitPendingLookups([pending(42)]);

    expect(settled[0].outcome).toBe('pending');
    expect(checkPersonLookupStatusMock).toHaveBeenCalledTimes(
      LOOKUP_POLL_MAX_ATTEMPTS,
    );
  });

  it('polls each profile id once even when several records share it', async () => {
    checkPersonLookupStatusMock.mockResolvedValueOnce(
      new Map([[42, matched(42)]]),
    );

    const settled = await awaitPendingLookups([pending(42), pending(42)]);

    expect(settled).toEqual([matched(42), matched(42)]);
    expect(checkPersonLookupStatusMock).toHaveBeenCalledWith([42]);
  });

  it('gives up on a pending result that carries no profile id', async () => {
    const withoutProfileId: RocketReachLookupResult<RocketReachPersonData> = {
      outcome: 'pending',
      httpStatus: 200,
      data: { status: 'searching' },
    };

    expect(await awaitPendingLookups([withoutProfileId])).toEqual([
      withoutProfileId,
    ]);
    expect(checkPersonLookupStatusMock).not.toHaveBeenCalled();
  });
});

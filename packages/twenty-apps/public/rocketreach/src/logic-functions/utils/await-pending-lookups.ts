import {
  CHECK_STATUS_BATCH_SIZE,
  LOOKUP_POLL_INTERVAL_MS,
  LOOKUP_POLL_MAX_ATTEMPTS,
} from 'src/constants/lookup-polling';
import { checkPersonLookupStatus } from 'src/logic-functions/utils/check-person-lookup-status';
import { chunk } from 'src/logic-functions/utils/chunk';
import { sleep } from 'src/logic-functions/utils/sleep';
import { type RocketReachLookupResult } from 'src/types/rocketreach-lookup-result';
import { type RocketReachPersonData } from 'src/types/rocketreach-person-data';
import { isDefined } from 'src/logic-functions/utils/is-defined';

type PersonLookupResult = RocketReachLookupResult<RocketReachPersonData>;

const collectPendingIndexesByProfileId = (
  results: PersonLookupResult[],
): Map<number, number[]> => {
  const indexesByProfileId = new Map<number, number[]>();

  for (const [index, result] of results.entries()) {
    if (result.outcome !== 'pending' || !isDefined(result.profileId)) {
      continue;
    }

    const indexes = indexesByProfileId.get(result.profileId) ?? [];
    indexes.push(index);
    indexesByProfileId.set(result.profileId, indexes);
  }

  return indexesByProfileId;
};

// A lookup that is still "progress" keeps its profile id, so check_status is
// polled for a bounded time before giving up and leaving the record PENDING
// for a later run.
export const awaitPendingLookups = async (
  results: PersonLookupResult[],
): Promise<PersonLookupResult[]> => {
  const settledResults = [...results];
  let pendingIndexesByProfileId =
    collectPendingIndexesByProfileId(settledResults);

  for (
    let attempt = 0;
    attempt < LOOKUP_POLL_MAX_ATTEMPTS && pendingIndexesByProfileId.size > 0;
    attempt++
  ) {
    await sleep(LOOKUP_POLL_INTERVAL_MS);

    const profileIds = [...pendingIndexesByProfileId.keys()];
    for (const profileIdsBatch of chunk({
      items: profileIds,
      size: CHECK_STATUS_BATCH_SIZE,
    })) {
      const resultByProfileId =
        await checkPersonLookupStatus(profileIdsBatch);

      for (const [profileId, result] of resultByProfileId) {
        for (const index of pendingIndexesByProfileId.get(profileId) ?? []) {
          settledResults[index] = result;
        }
      }
    }

    pendingIndexesByProfileId =
      collectPendingIndexesByProfileId(settledResults);
  }

  return settledResults;
};

import { awaitPendingLookups } from 'src/logic-functions/utils/await-pending-lookups';
import { lookupPerson } from 'src/logic-functions/utils/lookup-person';
import { resolveLookupConcurrency } from 'src/logic-functions/utils/resolve-lookup-concurrency';
import { runWithConcurrency } from 'src/logic-functions/utils/run-with-concurrency';
import { type RevealSettings } from 'src/types/reveal-settings';
import { type RocketReachLookupResult } from 'src/types/rocketreach-lookup-result';
import { type RocketReachPersonData } from 'src/types/rocketreach-person-data';
import { type RocketReachPersonLookupParams } from 'src/types/rocketreach-person-lookup-params';

// RocketReach's bulk endpoint needs a configured webhook and a minimum of ten
// lookups, so records are looked up one by one under a concurrency cap.
export const lookupPeople = async ({
  params,
  revealSettings,
}: {
  params: RocketReachPersonLookupParams[];
  revealSettings: RevealSettings;
}): Promise<RocketReachLookupResult<RocketReachPersonData>[]> => {
  const results = await runWithConcurrency({
    items: params,
    concurrency: resolveLookupConcurrency(),
    run: (lookupParams) => lookupPerson({ params: lookupParams, revealSettings }),
  });

  return awaitPendingLookups(results);
};

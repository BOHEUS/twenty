import { isArray } from '@sniptt/guards';

import { type RocketReachJobHistoryEntry } from 'src/types/rocketreach-person-data';

export const findCurrentJob = (
  jobHistory: unknown,
): RocketReachJobHistoryEntry | undefined => {
  if (!isArray(jobHistory)) {
    return undefined;
  }

  const entries = jobHistory as RocketReachJobHistoryEntry[];

  return (
    entries.find((entry) => entry?.is_current === true) ??
    entries.find((entry) => entry?.end_date === 'Present')
  );
};

import { isNonEmptyString } from '@sniptt/guards';

import { type HunterPerson } from 'src/types/hunter-person';

// Hunter bills an email enrichment only when it returns the email, the full
// name and the position
export const hasCorePersonData = (person: HunterPerson | undefined): boolean =>
  isNonEmptyString(person?.email) &&
  isNonEmptyString(person?.name?.fullName) &&
  isNonEmptyString(person?.employment?.title);

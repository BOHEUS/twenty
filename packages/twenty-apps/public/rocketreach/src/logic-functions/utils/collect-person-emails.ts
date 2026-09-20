import { isArray } from '@sniptt/guards';

import { type RocketReachPersonData } from 'src/types/rocketreach-person-data';

// Ordered so the primary email is the one RocketReach itself recommends.
export const collectPersonEmails = (
  personData: RocketReachPersonData,
): unknown[] => {
  const emailEntries = isArray(personData.emails) ? personData.emails : [];

  return [
    personData.recommended_professional_email,
    personData.current_work_email,
    personData.recommended_email,
    ...emailEntries.map((email) => email?.email),
    personData.recommended_personal_email,
    personData.current_personal_email,
  ];
};

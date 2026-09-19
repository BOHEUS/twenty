import { isArray } from '@sniptt/guards';

import {
  type CrustdataEmploymentEntry,
  type CrustdataPersonData,
} from 'src/types/crustdata-person-data';

export const currentEmployment = (
  personData: CrustdataPersonData,
): CrustdataEmploymentEntry | undefined => {
  const current = personData.experience?.employment_details?.current;

  return isArray(current) ? current[0] : undefined;
};

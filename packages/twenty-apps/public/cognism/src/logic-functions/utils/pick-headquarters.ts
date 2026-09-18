import { isArray } from '@sniptt/guards';

import { type CognismLocation } from 'src/logic-functions/types/cognism-location';

export const pickHeadquarters = (
  locations: unknown,
): CognismLocation | undefined => {
  if (!isArray(locations)) {
    return undefined;
  }

  const cognismLocations = locations as CognismLocation[];

  return (
    cognismLocations.find((location) => location?.headquarters === true) ??
    cognismLocations[0]
  );
};

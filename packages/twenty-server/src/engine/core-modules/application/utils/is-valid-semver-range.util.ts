import semver from 'semver';
import { isDefined } from 'twenty-shared/utils';

export const isValidSemverRange = (versionRange: string): boolean =>
  isDefined(semver.validRange(versionRange));

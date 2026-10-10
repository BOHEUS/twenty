import semver from 'semver';
import { isDefined } from 'twenty-shared/utils';

export const isValidSemverVersion = (version: string): boolean =>
  isDefined(semver.valid(version));

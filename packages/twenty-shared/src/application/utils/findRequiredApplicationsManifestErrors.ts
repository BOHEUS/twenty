import { isString } from '@sniptt/guards';

import { MAX_REQUIRED_APPLICATIONS } from '@/application/constants/MaxRequiredApplications';
import { isValidUniversalIdentifier } from '@/application/utils/isValidUniversalIdentifier';
import { isDefined } from '@/utils/validation/isDefined';
import { isPlainObject } from '@/utils/typeguard/isPlainObject';

// Takes the semver check as a parameter so twenty-shared stays free of semver.
// requiredApplications is unknown because the server receives the manifest as
// unchecked JSON.
// Only caret ranges are accepted: a dependent can then block a major upgrade
// of what it requires, but never the minor and patch releases carrying fixes.
export const findRequiredApplicationsManifestErrors = ({
  universalIdentifier,
  requiredApplications,
  isValidVersion,
}: {
  universalIdentifier: string;
  requiredApplications: unknown;
  isValidVersion: (version: string) => boolean;
}): string[] => {
  if (!isDefined(requiredApplications)) {
    return [];
  }

  if (!Array.isArray(requiredApplications)) {
    return ['requiredApplications must be an array'];
  }

  if (requiredApplications.length > MAX_REQUIRED_APPLICATIONS) {
    return [
      `An application can require at most ${MAX_REQUIRED_APPLICATIONS} applications`,
    ];
  }

  const errors: string[] = [];
  const requiredUniversalIdentifiers = new Set<string>();

  for (const requiredApplication of requiredApplications) {
    if (!isPlainObject(requiredApplication)) {
      errors.push('Each required application must be an object');

      continue;
    }

    const { universalIdentifier: requiredUniversalIdentifier, versionRange } =
      requiredApplication;

    if (
      !isString(requiredUniversalIdentifier) ||
      !isValidUniversalIdentifier(requiredUniversalIdentifier)
    ) {
      errors.push(
        `Required application universalIdentifier "${String(requiredUniversalIdentifier)}" must be a valid UUID`,
      );

      continue;
    }

    if (requiredUniversalIdentifier === universalIdentifier) {
      errors.push('Application cannot require itself');
    }

    if (requiredUniversalIdentifiers.has(requiredUniversalIdentifier)) {
      errors.push(
        `Required application "${requiredUniversalIdentifier}" is declared more than once`,
      );
    }

    requiredUniversalIdentifiers.add(requiredUniversalIdentifier);

    if (
      isDefined(versionRange) &&
      (!isString(versionRange) ||
        !versionRange.startsWith('^') ||
        !isValidVersion(versionRange.slice(1)))
    ) {
      errors.push(
        `Required application "${requiredUniversalIdentifier}" has an invalid versionRange "${String(versionRange)}". Must be a caret range such as ^1.2.0.`,
      );
    }
  }

  return errors;
};

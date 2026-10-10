import { type RequiredApplicationManifest } from 'twenty-shared/application';
import { isDefined } from 'twenty-shared/utils';

// Keeps only the declared keys, so the stored column cannot carry arbitrary
// manifest payload
export const toRequiredApplications = (
  requiredApplications: RequiredApplicationManifest[] | undefined,
): RequiredApplicationManifest[] =>
  (requiredApplications ?? []).map(({ universalIdentifier, versionRange }) =>
    isDefined(versionRange)
      ? { universalIdentifier, versionRange }
      : { universalIdentifier },
  );

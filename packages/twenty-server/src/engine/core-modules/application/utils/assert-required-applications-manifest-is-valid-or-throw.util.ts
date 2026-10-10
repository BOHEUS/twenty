import { msg } from '@lingui/core/macro';
import {
  type ApplicationManifest,
  findRequiredApplicationsManifestErrors,
} from 'twenty-shared/application';

import {
  ApplicationException,
  ApplicationExceptionCode,
} from 'src/engine/core-modules/application/application.exception';
import { isValidSemverRange } from 'src/engine/core-modules/application/utils/is-valid-semver-range.util';

export const assertRequiredApplicationsManifestIsValidOrThrow = ({
  universalIdentifier,
  requiredApplications,
}: Pick<
  ApplicationManifest,
  'universalIdentifier' | 'requiredApplications'
>): void => {
  const errors = findRequiredApplicationsManifestErrors({
    universalIdentifier,
    requiredApplications,
    isValidVersionRange: isValidSemverRange,
  });

  if (errors.length > 0) {
    throw new ApplicationException(
      `Invalid required applications: ${errors.join('; ')}`,
      ApplicationExceptionCode.INVALID_INPUT,
      {
        userFriendlyMessage: msg`This app declares invalid required applications. Contact its developer.`,
      },
    );
  }
};

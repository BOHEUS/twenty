import semver from 'semver';
import { isDefined } from 'twenty-shared/utils';

import { type ApplicationEntity } from 'src/engine/core-modules/application/application.entity';

export const findDependentApplicationsRejectingVersion = <
  TApplication extends Pick<ApplicationEntity, 'requiredApplications'>,
>({
  dependentApplications,
  applicationUniversalIdentifier,
  version,
}: {
  dependentApplications: TApplication[];
  applicationUniversalIdentifier: string;
  version: string;
}): TApplication[] =>
  dependentApplications.filter((dependentApplication) =>
    (dependentApplication.requiredApplications ?? []).some(
      ({ universalIdentifier, versionRange }) =>
        universalIdentifier === applicationUniversalIdentifier &&
        isDefined(versionRange) &&
        !semver.satisfies(version, versionRange),
    ),
  );

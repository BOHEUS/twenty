import semver from 'semver';
import { type RequiredApplicationManifest } from 'twenty-shared/application';
import { isDefined } from 'twenty-shared/utils';

import { type ApplicationEntity } from 'src/engine/core-modules/application/application.entity';

export type InstalledApplicationCandidate = Pick<
  ApplicationEntity,
  'universalIdentifier' | 'name' | 'version' | 'canBeUninstalled'
>;

export type UnsatisfiedRequiredApplications = {
  missingUniversalIdentifiers: string[];
  unrequirableApplicationNames: string[];
  incompatibleVersionDescriptions: string[];
};

export const findUnsatisfiedRequiredApplications = ({
  requiredApplications,
  installedApplications,
}: {
  requiredApplications: RequiredApplicationManifest[];
  installedApplications: InstalledApplicationCandidate[];
}): UnsatisfiedRequiredApplications => {
  const unsatisfiedRequiredApplications: UnsatisfiedRequiredApplications = {
    missingUniversalIdentifiers: [],
    unrequirableApplicationNames: [],
    incompatibleVersionDescriptions: [],
  };

  for (const { universalIdentifier, versionRange } of requiredApplications) {
    const installedApplication = installedApplications.find(
      (application) => application.universalIdentifier === universalIdentifier,
    );

    // A null version means the install never completed
    if (
      !isDefined(installedApplication) ||
      !isDefined(installedApplication.version)
    ) {
      unsatisfiedRequiredApplications.missingUniversalIdentifiers.push(
        universalIdentifier,
      );

      continue;
    }

    // Only applications managed by the install lifecycle can be required, which
    // leaves out the workspace's standard and custom applications
    if (!installedApplication.canBeUninstalled) {
      unsatisfiedRequiredApplications.unrequirableApplicationNames.push(
        installedApplication.name,
      );

      continue;
    }

    if (
      isDefined(versionRange) &&
      !semver.satisfies(installedApplication.version, versionRange)
    ) {
      unsatisfiedRequiredApplications.incompatibleVersionDescriptions.push(
        `${installedApplication.name} ${installedApplication.version} does not satisfy ${versionRange}`,
      );
    }
  }

  return unsatisfiedRequiredApplications;
};

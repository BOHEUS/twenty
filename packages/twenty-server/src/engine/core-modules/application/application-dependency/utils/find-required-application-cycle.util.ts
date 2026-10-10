import { type RequiredApplicationManifest } from 'twenty-shared/application';
import { isDefined } from 'twenty-shared/utils';

import { type ApplicationEntity } from 'src/engine/core-modules/application/application.entity';

// Returns the universal identifiers of a requirement path that leads back to
// the application, starting and ending with it, or undefined without a cycle.
// The application's own stored requirements are replaced by the ones being
// applied.
export const findRequiredApplicationCycle = ({
  applicationUniversalIdentifier,
  requiredApplications,
  applications,
}: {
  applicationUniversalIdentifier: string;
  requiredApplications: RequiredApplicationManifest[];
  applications: Pick<
    ApplicationEntity,
    'universalIdentifier' | 'requiredApplications'
  >[];
}): string[] | undefined => {
  const requiredUniversalIdentifiersByApplication = new Map<string, string[]>(
    applications.map((application) => [
      application.universalIdentifier,
      (application.requiredApplications ?? []).map(
        ({ universalIdentifier }) => universalIdentifier,
      ),
    ]),
  );

  requiredUniversalIdentifiersByApplication.set(
    applicationUniversalIdentifier,
    requiredApplications.map(({ universalIdentifier }) => universalIdentifier),
  );

  const visitedUniversalIdentifiers = new Set<string>();

  const findPathBackToApplication = (
    universalIdentifier: string,
  ): string[] | undefined => {
    if (universalIdentifier === applicationUniversalIdentifier) {
      return [universalIdentifier];
    }

    if (visitedUniversalIdentifiers.has(universalIdentifier)) {
      return undefined;
    }

    visitedUniversalIdentifiers.add(universalIdentifier);

    for (const requiredUniversalIdentifier of requiredUniversalIdentifiersByApplication.get(
      universalIdentifier,
    ) ?? []) {
      const path = findPathBackToApplication(requiredUniversalIdentifier);

      if (isDefined(path)) {
        return [universalIdentifier, ...path];
      }
    }

    return undefined;
  };

  for (const { universalIdentifier } of requiredApplications) {
    const path = findPathBackToApplication(universalIdentifier);

    if (isDefined(path)) {
      return [applicationUniversalIdentifier, ...path];
    }
  }

  return undefined;
};

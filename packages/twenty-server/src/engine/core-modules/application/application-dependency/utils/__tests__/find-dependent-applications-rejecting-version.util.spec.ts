import { findDependentApplicationsRejectingVersion } from 'src/engine/core-modules/application/application-dependency/utils/find-dependent-applications-rejecting-version.util';

const PROVIDER_UNIVERSAL_IDENTIFIER = 'provider-universal-identifier';

const PINNED_DEPENDENT = {
  name: 'Pinned dependent',
  requiredApplications: [
    {
      universalIdentifier: PROVIDER_UNIVERSAL_IDENTIFIER,
      versionRange: '^1.0.0',
    },
  ],
};

const ANY_VERSION_DEPENDENT = {
  name: 'Any version dependent',
  requiredApplications: [
    { universalIdentifier: PROVIDER_UNIVERSAL_IDENTIFIER },
  ],
};

describe('findDependentApplicationsRejectingVersion', () => {
  it('should return nothing when every dependent accepts the version', () => {
    expect(
      findDependentApplicationsRejectingVersion({
        dependentApplications: [PINNED_DEPENDENT, ANY_VERSION_DEPENDENT],
        applicationUniversalIdentifier: PROVIDER_UNIVERSAL_IDENTIFIER,
        version: '1.9.0',
      }),
    ).toEqual([]);
  });

  it('should return only the dependents whose range excludes the version', () => {
    expect(
      findDependentApplicationsRejectingVersion({
        dependentApplications: [PINNED_DEPENDENT, ANY_VERSION_DEPENDENT],
        applicationUniversalIdentifier: PROVIDER_UNIVERSAL_IDENTIFIER,
        version: '2.0.0',
      }),
    ).toEqual([PINNED_DEPENDENT]);
  });
});

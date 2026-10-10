import {
  findUnsatisfiedRequiredApplications,
  type InstalledApplicationCandidate,
} from 'src/engine/core-modules/application/application-dependency/utils/find-unsatisfied-required-applications.util';

const PROVIDER_UNIVERSAL_IDENTIFIER = 'provider-universal-identifier';

const PROVIDER: InstalledApplicationCandidate = {
  universalIdentifier: PROVIDER_UNIVERSAL_IDENTIFIER,
  name: 'Provider',
  version: '1.4.0',
  canBeUninstalled: true,
};

const NOTHING_UNSATISFIED = {
  missingUniversalIdentifiers: [],
  unrequirableApplicationNames: [],
  incompatibleVersionDescriptions: [],
};

describe('findUnsatisfiedRequiredApplications', () => {
  it('should accept an installed application within the range', () => {
    expect(
      findUnsatisfiedRequiredApplications({
        requiredApplications: [
          {
            universalIdentifier: PROVIDER_UNIVERSAL_IDENTIFIER,
            versionRange: '^1.2.0',
          },
        ],
        installedApplications: [PROVIDER],
      }),
    ).toEqual(NOTHING_UNSATISFIED);
  });

  it('should report an application that is not installed', () => {
    expect(
      findUnsatisfiedRequiredApplications({
        requiredApplications: [
          { universalIdentifier: PROVIDER_UNIVERSAL_IDENTIFIER },
        ],
        installedApplications: [],
      }),
    ).toEqual({
      ...NOTHING_UNSATISFIED,
      missingUniversalIdentifiers: [PROVIDER_UNIVERSAL_IDENTIFIER],
    });
  });

  it('should report an application whose install never completed as missing', () => {
    expect(
      findUnsatisfiedRequiredApplications({
        requiredApplications: [
          { universalIdentifier: PROVIDER_UNIVERSAL_IDENTIFIER },
        ],
        installedApplications: [{ ...PROVIDER, version: null }],
      }),
    ).toEqual({
      ...NOTHING_UNSATISFIED,
      missingUniversalIdentifiers: [PROVIDER_UNIVERSAL_IDENTIFIER],
    });
  });

  it('should report a system application as not requirable', () => {
    expect(
      findUnsatisfiedRequiredApplications({
        requiredApplications: [
          { universalIdentifier: PROVIDER_UNIVERSAL_IDENTIFIER },
        ],
        installedApplications: [{ ...PROVIDER, canBeUninstalled: false }],
      }),
    ).toEqual({
      ...NOTHING_UNSATISFIED,
      unrequirableApplicationNames: ['Provider'],
    });
  });

  it('should report an installed version outside the range', () => {
    expect(
      findUnsatisfiedRequiredApplications({
        requiredApplications: [
          {
            universalIdentifier: PROVIDER_UNIVERSAL_IDENTIFIER,
            versionRange: '^2.0.0',
          },
        ],
        installedApplications: [PROVIDER],
      }),
    ).toEqual({
      ...NOTHING_UNSATISFIED,
      incompatibleVersionDescriptions: [
        'Provider 1.4.0 does not satisfy ^2.0.0',
      ],
    });
  });
});

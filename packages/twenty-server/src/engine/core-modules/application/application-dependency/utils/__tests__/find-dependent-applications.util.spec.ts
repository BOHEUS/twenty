import { findDependentApplications } from 'src/engine/core-modules/application/application-dependency/utils/find-dependent-applications.util';

const PROVIDER_UNIVERSAL_IDENTIFIER = 'provider-universal-identifier';

describe('findDependentApplications', () => {
  it('should return only the applications that require the given one', () => {
    const dependentApplication = {
      name: 'Dependent',
      requiredApplications: [
        { universalIdentifier: PROVIDER_UNIVERSAL_IDENTIFIER },
      ],
    };

    expect(
      findDependentApplications({
        applications: [
          { name: 'Provider', requiredApplications: [] },
          dependentApplication,
          {
            name: 'Unrelated',
            requiredApplications: [
              { universalIdentifier: 'other-provider-universal-identifier' },
            ],
          },
        ],
        applicationUniversalIdentifier: PROVIDER_UNIVERSAL_IDENTIFIER,
      }),
    ).toEqual([dependentApplication]);
  });
});

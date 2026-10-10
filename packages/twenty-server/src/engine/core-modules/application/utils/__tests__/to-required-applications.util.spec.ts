import { toRequiredApplications } from 'src/engine/core-modules/application/utils/to-required-applications.util';

describe('toRequiredApplications', () => {
  it('should default to an empty list', () => {
    expect(toRequiredApplications(undefined)).toEqual([]);
  });

  it('should keep only the declared keys', () => {
    const requiredApplications = JSON.parse(
      '[{"universalIdentifier":"a","versionRange":"^1.0.0","payload":"x"},{"universalIdentifier":"b"}]',
    );

    expect(toRequiredApplications(requiredApplications)).toEqual([
      { universalIdentifier: 'a', versionRange: '^1.0.0' },
      { universalIdentifier: 'b' },
    ]);
  });
});

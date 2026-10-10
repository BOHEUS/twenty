import { MAX_REQUIRED_APPLICATIONS } from '@/application/constants/MaxRequiredApplications';
import { findRequiredApplicationsManifestErrors } from '@/application/utils/findRequiredApplicationsManifestErrors';

const APPLICATION_UNIVERSAL_IDENTIFIER = 'a9faf5f8-cf7e-4f24-9d37-fd523c30febe';
const REQUIRED_APPLICATION_UNIVERSAL_IDENTIFIER =
  '0f4d43b5-46e6-4a43-9d64-3c2f4f3c4f0b';

const isValidVersionRange = (versionRange: string) =>
  versionRange.startsWith('^');

const findErrors = (requiredApplications: unknown) =>
  findRequiredApplicationsManifestErrors({
    universalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
    requiredApplications,
    isValidVersionRange,
  });

describe('findRequiredApplicationsManifestErrors', () => {
  it('should accept a manifest without required applications', () => {
    expect(findErrors(undefined)).toEqual([]);
  });

  it('should accept required applications with and without a version range', () => {
    expect(
      findErrors([
        {
          universalIdentifier: REQUIRED_APPLICATION_UNIVERSAL_IDENTIFIER,
          versionRange: '^1.2.0',
        },
        { universalIdentifier: '9d4a7a51-63fa-45d5-a7b6-12e9f3e4fb0c' },
      ]),
    ).toEqual([]);
  });

  it('should reject a value that is not an array', () => {
    expect(findErrors({})).toEqual(['requiredApplications must be an array']);
  });

  it('should reject more required applications than allowed', () => {
    expect(
      findErrors(
        Array.from({ length: MAX_REQUIRED_APPLICATIONS + 1 }, () => ({
          universalIdentifier: REQUIRED_APPLICATION_UNIVERSAL_IDENTIFIER,
        })),
      ),
    ).toEqual([
      `An application can require at most ${MAX_REQUIRED_APPLICATIONS} applications`,
    ]);
  });

  it('should report every invalid entry', () => {
    expect(
      findErrors([
        null,
        { universalIdentifier: 'not-a-uuid' },
        { universalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER },
        {
          universalIdentifier: REQUIRED_APPLICATION_UNIVERSAL_IDENTIFIER,
          versionRange: 'latest',
        },
        {
          universalIdentifier: REQUIRED_APPLICATION_UNIVERSAL_IDENTIFIER,
          versionRange: 12,
        },
      ]),
    ).toEqual([
      'Each required application must be an object',
      'Required application universalIdentifier "not-a-uuid" must be a valid UUID',
      'Application cannot require itself',
      `Required application "${REQUIRED_APPLICATION_UNIVERSAL_IDENTIFIER}" has an invalid versionRange "latest". Must be a valid semver range.`,
      `Required application "${REQUIRED_APPLICATION_UNIVERSAL_IDENTIFIER}" is declared more than once`,
      `Required application "${REQUIRED_APPLICATION_UNIVERSAL_IDENTIFIER}" has an invalid versionRange "12". Must be a valid semver range.`,
    ]);
  });
});

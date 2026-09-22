import { describe, expect, it } from 'vitest';

import { hasAllRequestedData } from 'src/logic-functions/shared/has-all-requested-data';
import { type TwentyCompany, type TwentyPerson } from 'src/logic-functions/types/twenty.types';

const buildPerson = (overrides: Partial<TwentyPerson> = {}): TwentyPerson =>
  ({
    id: '20202020-0000-4000-8000-000000000001',
    name: { firstName: 'John', lastName: 'Snow' },
    emails: { primaryEmail: '', additionalEmails: null },
    phones: {
      primaryPhoneNumber: '',
      primaryPhoneCallingCode: '',
      primaryPhoneCountryCode: '',
      additionalPhones: null,
    },
    jobTitle: '',
    fullEnrichAbout: null,
    fullEnrichLocation: null,
    ...overrides,
  }) as TwentyPerson;

const buildCompany = (overrides: Partial<TwentyCompany> = {}): TwentyCompany =>
  ({
    id: '20202020-0000-4000-8000-000000000002',
    name: 'Example Inc',
    fullEnrichHeadcount: null,
    ...overrides,
  }) as TwentyCompany;

describe('hasAllRequestedData', () => {
  it('should always enrich when no constraint was selected', () => {
    expect(
      hasAllRequestedData({
        person: buildPerson({
          emails: { primaryEmail: 'john@example.com', additionalEmails: null },
          jobTitle: 'Head of Sales',
        }),
        selectedConstraints: [],
      }),
    ).toBe(false);
  });

  it('should skip a record that already satisfies every selected constraint', () => {
    expect(
      hasAllRequestedData({
        person: buildPerson({
          emails: { primaryEmail: 'john@example.com', additionalEmails: null },
          jobTitle: 'Head of Sales',
        }),
        selectedConstraints: ['person.email', 'person.jobTitle'],
      }),
    ).toBe(true);
  });

  it('should enrich when one selected constraint is still missing', () => {
    expect(
      hasAllRequestedData({
        person: buildPerson({
          emails: { primaryEmail: 'john@example.com', additionalEmails: null },
        }),
        selectedConstraints: ['person.email', 'person.phones'],
      }),
    ).toBe(false);
  });

  it('should count an unfetched company as not satisfying a company constraint', () => {
    expect(
      hasAllRequestedData({
        person: buildPerson(),
        selectedConstraints: ['company.headcount'],
      }),
    ).toBe(false);
    expect(
      hasAllRequestedData({
        person: buildPerson(),
        company: buildCompany({ fullEnrichHeadcount: 250 }),
        selectedConstraints: ['company.headcount'],
      }),
    ).toBe(true);
  });

  it('should ignore a constraint it does not know', () => {
    expect(
      hasAllRequestedData({
        person: buildPerson(),
        selectedConstraints: ['person.unknownConstraint'],
      }),
    ).toBe(false);
  });
});

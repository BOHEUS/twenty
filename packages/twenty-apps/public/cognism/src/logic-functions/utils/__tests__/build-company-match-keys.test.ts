import { describe, expect, it } from 'vitest';

import { buildCompanyMatchKeys } from 'src/logic-functions/utils/build-company-match-keys';
import { type CognismPersonData } from 'src/logic-functions/types/cognism-person-data';

describe('buildCompanyMatchKeys', () => {
  it('extracts and trims the account identifiers from Cognism data', () => {
    const keys = buildCompanyMatchKeys({
      account: {
        id: '  cognism-account-1 ',
        domain: 'acme.com',
        linkedinUrl: 'https://linkedin.com/company/acme',
        name: 'Acme',
      },
    } as CognismPersonData);

    expect(keys).toEqual({
      cognismId: 'cognism-account-1',
      website: 'acme.com',
      linkedinUrl: 'linkedin.com/company/acme',
      name: 'Acme',
    });
  });

  it('falls back to the account website when no domain is returned', () => {
    expect(
      buildCompanyMatchKeys({
        account: { website: 'https://www.acme.com/about' },
      } as CognismPersonData),
    ).toEqual({ website: 'acme.com' });
  });

  it('omits identifiers Cognism did not return or that are blank', () => {
    expect(
      buildCompanyMatchKeys({
        account: { name: '   ', domain: 'acme.com' },
      } as CognismPersonData),
    ).toEqual({ website: 'acme.com' });
  });

  it('returns an empty object when no account identifiers are present', () => {
    expect(buildCompanyMatchKeys({} as CognismPersonData)).toEqual({});
  });
});

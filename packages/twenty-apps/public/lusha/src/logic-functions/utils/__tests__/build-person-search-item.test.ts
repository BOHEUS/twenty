import { describe, expect, it } from 'vitest';

import { buildPersonSearchItem } from 'src/logic-functions/utils/build-person-search-item';

describe('buildPersonSearchItem', () => {
  it('should look a person up by the Lusha id it already has', () => {
    expect(
      buildPersonSearchItem({
        id: 'person-1',
        lushaId: '4389064704',
        emails: { primaryEmail: 'orit@lusha.com' },
      }),
    ).toEqual({ clientReferenceId: 'person-1', id: '4389064704' });
  });

  it('should send every identifier the person has', () => {
    expect(
      buildPersonSearchItem({
        id: 'person-1',
        name: { firstName: 'Orit', lastName: 'Shilvock' },
        emails: { primaryEmail: 'Orit.Shilvock@Lusha.com' },
        linkedinLink: { primaryLinkUrl: 'linkedin.com/in/orit-shilvock/' },
        company: {
          name: 'Lusha',
          domainName: { primaryLinkUrl: 'https://www.lusha.com' },
        },
      }),
    ).toEqual({
      clientReferenceId: 'person-1',
      email: 'orit.shilvock@lusha.com',
      linkedinUrl: 'https://www.linkedin.com/in/orit-shilvock',
      firstName: 'Orit',
      lastName: 'Shilvock',
      companyName: 'Lusha',
      companyDomain: 'lusha.com',
    });
  });

  it('should leave out a name that has no employer to go with it', () => {
    expect(
      buildPersonSearchItem({
        id: 'person-1',
        name: { firstName: 'Orit', lastName: 'Shilvock' },
        emails: { primaryEmail: 'orit@lusha.com' },
      }),
    ).toEqual({ clientReferenceId: 'person-1', email: 'orit@lusha.com' });
  });

  it('should match on a full name and employer alone', () => {
    expect(
      buildPersonSearchItem({
        id: 'person-1',
        name: { firstName: 'Orit', lastName: 'Shilvock' },
        company: { name: 'Lusha' },
      }),
    ).toEqual({
      clientReferenceId: 'person-1',
      firstName: 'Orit',
      lastName: 'Shilvock',
      companyName: 'Lusha',
    });
  });

  it('should skip a person with nothing Lusha can match on', () => {
    expect(
      buildPersonSearchItem({
        id: 'person-1',
        name: { firstName: 'Orit', lastName: '' },
        emails: { primaryEmail: 'not-an-email' },
        linkedinLink: { primaryLinkUrl: 'https://twitter.com/orit' },
        company: { name: 'Lusha' },
      }),
    ).toBeUndefined();
  });
});

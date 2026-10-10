import { describe, expect, it } from 'vitest';

import { mapPerson } from 'src/logic-functions/utils/map-person';

describe('mapPerson', () => {
  it('maps the combined person data', () => {
    const { standard, hunter } = mapPerson({
      person: {
        id: 'person-1',
        name: { fullName: 'Jane Doe', givenName: 'jane', familyName: 'doe' },
        email: 'jane@acme.com',
        phone: '+1 512 555 0100',
        bio: 'Builds anvils.',
        timeZone: 'America/Chicago',
        geo: { city: 'Austin', state: 'Texas', country: 'United States' },
        employment: {
          title: 'CEO',
          role: 'leadership',
          seniority: 'executive',
        },
        linkedin: { handle: 'janedoe' },
        twitter: { handle: 'jane', followers: 120 },
        github: { handle: 'jdoe' },
      },
    });

    expect(standard).toMatchObject({
      name: { firstName: 'Jane', lastName: 'Doe' },
      emails: { primaryEmail: 'jane@acme.com' },
      phones: { primaryPhoneNumber: '+1 512 555 0100' },
      jobTitle: 'CEO',
      linkedinLink: { primaryLinkUrl: 'https://www.linkedin.com/in/janedoe' },
    });
    expect(hunter).toMatchObject({
      hunterId: 'person-1',
      hunterBio: 'Builds anvils.',
      hunterRole: 'leadership',
      hunterSeniority: 'executive',
      hunterLocation: { addressCity: 'Austin', addressState: 'Texas' },
      hunterXLink: { primaryLinkUrl: 'https://x.com/jane' },
      hunterXFollowers: 120,
      hunterGithubLink: { primaryLinkUrl: 'https://github.com/jdoe' },
    });
  });

  it('writes a found email only when Hunter verified it', () => {
    const verified = mapPerson({
      emailFinder: {
        email: 'jane@acme.com',
        score: 97,
        verification: { status: 'valid' },
      },
    });
    const acceptAll = mapPerson({
      emailFinder: {
        email: 'jane@acme.com',
        score: 60,
        verification: { status: 'accept_all' },
      },
      person: { email: 'jane@acme.com' },
    });

    expect(verified.standard.emails).toMatchObject({
      primaryEmail: 'jane@acme.com',
    });
    expect(acceptAll.standard.emails).toBeUndefined();
    expect(acceptAll.hunter).toMatchObject({
      hunterFoundEmail: 'jane@acme.com',
      hunterEmailStatus: 'accept_all',
      hunterEmailScore: 60,
    });
  });
});

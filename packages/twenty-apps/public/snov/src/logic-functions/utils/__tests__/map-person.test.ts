import { describe, expect, it } from 'vitest';

import { mapPerson } from 'src/logic-functions/utils/map-person';

describe('mapPerson', () => {
  it('maps the email profile to standard and Snov.io fields', () => {
    const { standard, snov } = mapPerson({
      email: 'jane@acme.com',
      emailCheck: { email: 'jane@acme.com', smtp_status: 'valid' },
      emailProfile: {
        id: 42,
        firstName: 'jane',
        lastName: 'doe',
        industry: 'Software',
        country: 'United States',
        locality: 'Austin',
        lastUpdateDate: '2026-09-14 10:00:00',
        social: [
          { type: 'linkedIn', link: 'https://www.linkedin.com/in/jane' },
        ],
        currentJobs: [{ position: 'CEO', startDate: '2021-03' }],
        previousJobs: [{ companyName: 'Initech', position: 'CTO' }],
      },
    });

    expect(standard).toMatchObject({
      name: { firstName: 'Jane', lastName: 'Doe' },
      emails: { primaryEmail: 'jane@acme.com' },
      jobTitle: 'CEO',
      linkedinLink: { primaryLinkUrl: 'https://www.linkedin.com/in/jane' },
    });
    expect(snov).toMatchObject({
      snovId: '42',
      snovIndustry: 'Software',
      snovLocation: { addressCity: 'Austin', addressCountry: 'United States' },
      snovJobStartDate: '2021-03-01',
      snovPreviousJobs: [{ companyName: 'Initech', position: 'CTO' }],
      snovEmailStatus: 'valid',
      snovFoundEmail: 'jane@acme.com',
      snovLastUpdatedAt: '2026-09-14',
    });
  });

  it('keeps an unverified found email out of the standard emails', () => {
    const { standard, snov } = mapPerson({
      email: 'j.doe@acme.com',
      emailCheck: { email: 'j.doe@acme.com', smtp_status: 'unknown' },
    });

    expect(standard.emails).toBeUndefined();
    expect(snov.snovFoundEmail).toBe('j.doe@acme.com');
  });

  it('maps a LinkedIn profile when no email profile was found', () => {
    const { standard, snov } = mapPerson({
      linkedinProfile: {
        first_name: 'Jane',
        last_name: 'Doe',
        country: 'France',
        location: 'Paris',
        skills: ['Sales', 'CRM'],
        positions: [{ title: 'Head of Sales', name: 'Acme' }],
      },
    });

    expect(standard).toMatchObject({
      name: { firstName: 'Jane', lastName: 'Doe' },
      jobTitle: 'Head of Sales',
    });
    expect(snov).toMatchObject({
      snovSkills: ['Sales', 'CRM'],
      snovLocation: { addressCity: 'Paris', addressCountry: 'France' },
    });
  });
});

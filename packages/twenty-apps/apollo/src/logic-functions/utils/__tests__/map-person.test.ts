import { describe, expect, it } from 'vitest';

import {
  buildPersonApolloData,
  buildPersonStandardData,
} from 'src/logic-functions/utils/map-person';

const ENRICHED_AT = '2026-09-09T10:00:00.000Z';

const person = {
  id: '583f2c0ba6da98d5477c6432',
  first_name: 'Tim',
  last_name: 'Zheng',
  name: 'Tim Zheng',
  title: 'Founder & CEO',
  headline: 'Founder & CEO at Apollo.io',
  email: 'tim@apollo.io',
  email_status: 'verified',
  extrapolated_email_confidence: 0.92,
  personal_emails: ['tim@example.com'],
  photo_url: 'https://zenprospect.s3.amazonaws.com/photo.jpg',
  linkedin_url: 'https://www.linkedin.com/in/tim-zheng',
  twitter_url: 'https://twitter.com/tim',
  github_url: null,
  facebook_url: 'https://www.facebook.com/tim',
  city: 'San Francisco',
  state: 'California',
  country: 'United States',
  seniority: 'founder',
  departments: ['c_suite'],
  subdepartments: ['founder'],
  functions: ['entrepreneurship'],
  match_confidence: 'high',
  is_likely_to_engage: true,
  show_intent: false,
  revealed_for_current_team: true,
  contact_id: '6011d2b0b8f1b1000144d6ce',
  account_id: '6011d2b0b8f1b1000144d6cd',
  organization_id: '5e66b6381e05b4008c8331b8',
  employment_history: [
    { organization_name: 'Apollo', title: 'CEO', current: true },
  ],
  contact: {
    phone_numbers: [
      { raw_number: '+1 415 555 0101', sanitized_number: '+14155550101' },
    ],
  },
};

describe('buildPersonStandardData', () => {
  it('should map the values the standard Person object already holds', () => {
    expect(buildPersonStandardData(person)).toEqual({
      name: { firstName: 'Tim', lastName: 'Zheng' },
      emails: { primaryEmail: 'tim@apollo.io' },
      jobTitle: 'Founder & CEO',
      linkedinLink: {
        primaryLinkUrl: 'https://www.linkedin.com/in/tim-zheng',
        primaryLinkLabel: 'LinkedIn',
      },
      phones: { primaryPhoneNumber: '+14155550101' },
    });
  });
});

describe('buildPersonApolloData', () => {
  const data = buildPersonApolloData({ person, enrichedAt: ENRICHED_AT });

  it('should map the values the standard Person object has no field for', () => {
    expect(data).toMatchObject({
      apolloId: '583f2c0ba6da98d5477c6432',
      apolloHeadline: 'Founder & CEO at Apollo.io',
      apolloSeniority: 'FOUNDER',
      apolloDepartments: ['c_suite'],
      apolloSubdepartments: ['founder'],
      apolloFunctions: ['entrepreneurship'],
      apolloEmailStatus: 'verified',
      apolloEmailConfidence: 0.92,
      apolloPersonalEmails: ['tim@example.com'],
      apolloMatchConfidence: 'HIGH',
      apolloIsLikelyToEngage: true,
      apolloShowIntent: false,
      apolloRevealedForCurrentTeam: true,
      apolloContactId: '6011d2b0b8f1b1000144d6ce',
      apolloAccountId: '6011d2b0b8f1b1000144d6cd',
      apolloOrganizationId: '5e66b6381e05b4008c8331b8',
      apolloLastEnrichedAt: ENRICHED_AT,
      apolloEnrichmentStatus: 'ENRICHED',
    });
  });

  it('should map city, state and country into the location address', () => {
    expect(data.apolloLocation).toEqual({
      addressStreet1: '',
      addressCity: 'San Francisco',
      addressState: 'California',
      addressPostcode: '',
      addressCountry: 'United States',
    });
  });

  it('should keep every phone number Apollo returned', () => {
    expect(data.apolloPhoneNumbers).toEqual([
      { raw_number: '+1 415 555 0101', sanitized_number: '+14155550101' },
    ]);
  });

  it('should keep the employment history', () => {
    expect(data.apolloEmploymentHistory).toEqual([
      { organization_name: 'Apollo', title: 'CEO', current: true },
    ]);
  });

  it('should omit social profiles Apollo returned as null', () => {
    expect(data).not.toHaveProperty('apolloGithubLink');
    expect(data.apolloXLink).toEqual({
      primaryLinkUrl: 'https://twitter.com/tim',
      primaryLinkLabel: 'X',
    });
  });

  it('should drop a seniority outside the option list rather than fail the write', () => {
    const data = buildPersonApolloData({
      person: { seniority: 'chief_vibes_officer' },
      enrichedAt: ENRICHED_AT,
    });

    expect(data).not.toHaveProperty('apolloSeniority');
  });
});

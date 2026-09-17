import { describe, expect, it } from 'vitest';

import { mergeEmails } from 'src/logic-functions/utils/merge-emails';

describe('mergeEmails', () => {
  it('should make the best Lusha email primary when the person has none', () => {
    expect(
      mergeEmails({
        currentEmails: { primaryEmail: '', additionalEmails: null },
        lushaEmails: ['orit@lusha.com', 'orit@gmail.com'],
      }),
    ).toEqual({
      primaryEmail: 'orit@lusha.com',
      additionalEmails: ['orit@gmail.com'],
    });
  });

  it('should keep the current primary email and add the new ones', () => {
    expect(
      mergeEmails({
        currentEmails: {
          primaryEmail: 'orit@old-company.com',
          additionalEmails: ['orit@gmail.com'],
        },
        lushaEmails: ['orit@lusha.com', 'ORIT@gmail.com'],
      }),
    ).toEqual({
      primaryEmail: 'orit@old-company.com',
      additionalEmails: ['orit@gmail.com', 'orit@lusha.com'],
    });
  });

  it('should change nothing when the person already has every email', () => {
    expect(
      mergeEmails({
        currentEmails: {
          primaryEmail: 'Orit@Lusha.com',
          additionalEmails: ['orit@gmail.com'],
        },
        lushaEmails: ['orit@lusha.com', 'orit@gmail.com'],
      }),
    ).toBeUndefined();
  });

  it('should change nothing when Lusha returned no email', () => {
    expect(
      mergeEmails({
        currentEmails: null,
        lushaEmails: [],
      }),
    ).toBeUndefined();
  });
});

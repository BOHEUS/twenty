import { describe, expect, it } from 'vitest';

import { buildTwentyEmails } from 'src/logic-functions/data/build-twenty-emails.util';

describe('buildTwentyEmails', () => {
  it("should use FullEnrich's own pick as the primary email", () => {
    const emails = buildTwentyEmails({
      most_probable_work_email: {
        email: 'john.snow@example.com',
        status: 'DELIVERABLE',
      },
      work_emails: [
        { email: 'john.snow@example.com', status: 'DELIVERABLE' },
        { email: 'j.snow@example.com', status: 'HIGH_PROBABILITY' },
      ],
      personal_emails: [{ email: 'johnsnow@gmail.com', status: 'DELIVERABLE' }],
    });

    expect(emails).toEqual({
      primaryEmail: 'john.snow@example.com',
      additionalEmails: ['j.snow@example.com', 'johnsnow@gmail.com'],
    });
  });

  it('should ignore addresses that are not deliverable', () => {
    const emails = buildTwentyEmails({
      work_emails: [
        { email: 'invalid@example.com', status: 'INVALID' },
        { email: 'catchall@example.com', status: 'CATCH_ALL' },
        { email: 'good@example.com', status: 'HIGH_PROBABILITY' },
      ],
    });

    expect(emails).toEqual({
      primaryEmail: 'good@example.com',
      additionalEmails: null,
    });
  });

  it('should return undefined rather than an empty address', () => {
    expect(buildTwentyEmails({})).toBeUndefined();
    expect(
      buildTwentyEmails({
        work_emails: [{ email: 'invalid@example.com', status: 'INVALID' }],
      }),
    ).toBeUndefined();
  });
});

import { describe, expect, it } from 'vitest';

import { extractPersonMatchParams } from 'src/logic-functions/utils/extract-person-match-params';

describe('extractPersonMatchParams', () => {
  it('reuses a stored profile id and ignores weaker signals', () => {
    expect(
      extractPersonMatchParams({
        node: {
          id: 'record-1',
          rocketReachId: '1234',
          emails: { primaryEmail: 'ada@example.com' },
        },
      }),
    ).toEqual({ profileId: 1234 });
  });

  it('uses email and LinkedIn when there is no profile id', () => {
    expect(
      extractPersonMatchParams({
        node: {
          id: 'record-1',
          emails: { primaryEmail: 'ada@example.com' },
          linkedinLink: {
            primaryLinkUrl: 'https://linkedin.com/in/adalovelace',
          },
        },
      }),
    ).toEqual({
      email: 'ada@example.com',
      linkedinUrl: 'https://linkedin.com/in/adalovelace',
    });
  });

  it('drops a name that has no company to pair with', () => {
    expect(
      extractPersonMatchParams({
        node: { id: 'record-1', name: { firstName: 'Ada', lastName: 'Lovelace' } },
      }),
    ).toBeUndefined();
  });

  it('sends the name with its employer when both are known', () => {
    expect(
      extractPersonMatchParams({
        node: {
          id: 'record-1',
          name: { firstName: 'Ada', lastName: 'Lovelace' },
          company: { id: 'company-1', name: 'Analytical Engines Ltd' },
          jobTitle: 'Head of Analytical Engines',
        },
      }),
    ).toEqual({
      name: 'Ada Lovelace',
      currentEmployer: 'Analytical Engines Ltd',
      title: 'Head of Analytical Engines',
    });
  });

  it('skips a record with no usable identifier', () => {
    expect(extractPersonMatchParams({ node: { id: 'record-1' } })).toBeUndefined();
  });
});

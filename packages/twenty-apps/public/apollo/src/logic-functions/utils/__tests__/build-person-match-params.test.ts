import { describe, expect, it } from 'vitest';

import { buildPersonMatchParams } from 'src/logic-functions/utils/build-person-match-params';

describe('buildPersonMatchParams', () => {
  it('should build params from an email alone', () => {
    expect(
      buildPersonMatchParams({
        id: 'person-1',
        emails: { primaryEmail: 'tim@apollo.io' },
      }),
    ).toEqual({ email: 'tim@apollo.io' });
  });

  it('should build params from a name paired with the employer domain', () => {
    expect(
      buildPersonMatchParams({
        id: 'person-1',
        name: { firstName: 'Tim', lastName: 'Zheng' },
        company: { domainName: { primaryLinkUrl: 'https://www.apollo.io' } },
      }),
    ).toEqual({ firstName: 'Tim', lastName: 'Zheng', domain: 'apollo.io' });
  });

  it('should skip a person carrying only a name', () => {
    expect(
      buildPersonMatchParams({
        id: 'person-1',
        name: { firstName: 'Tim', lastName: 'Zheng' },
      }),
    ).toBeUndefined();
  });

  it('should skip a person carrying no identifier at all', () => {
    expect(buildPersonMatchParams({ id: 'person-1' })).toBeUndefined();
  });
});

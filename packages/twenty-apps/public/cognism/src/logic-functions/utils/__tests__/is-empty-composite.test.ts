import { describe, expect, it } from 'vitest';

import { isEmptyComposite } from 'src/logic-functions/utils/is-empty-composite';

const isEmptyLinks = isEmptyComposite('primaryLinkUrl');
const isEmptyFullName = isEmptyComposite('firstName', 'lastName');

describe('isEmptyComposite', () => {
  it('is true when the value is not a composite object', () => {
    expect(isEmptyLinks(null)).toBe(true);
    expect(isEmptyLinks('https://acme.com')).toBe(true);
  });

  it('is true when every sub field is empty, whitespace or missing', () => {
    expect(isEmptyLinks({ primaryLinkUrl: '' })).toBe(true);
    expect(isEmptyFullName({ firstName: '   ', lastName: null })).toBe(true);
    expect(isEmptyFullName({})).toBe(true);
  });

  it('is false when at least one sub field is present', () => {
    expect(isEmptyLinks({ primaryLinkUrl: 'https://acme.com' })).toBe(false);
    expect(isEmptyFullName({ firstName: 'Ada', lastName: '' })).toBe(false);
  });

  it('ignores sub fields it was not asked about', () => {
    expect(isEmptyLinks({ secondaryLinks: ['https://acme.com'] })).toBe(true);
  });
});

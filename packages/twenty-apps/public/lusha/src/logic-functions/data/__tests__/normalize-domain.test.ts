import { describe, expect, it } from 'vitest';

import { normalizeDomain } from 'src/logic-functions/data/normalize-domain';

describe('normalizeDomain', () => {
  it('should reduce a website to its bare host', () => {
    expect(normalizeDomain('https://www.Lusha.com/pricing?plan=pro')).toBe(
      'lusha.com',
    );
    expect(normalizeDomain('www.lusha.com')).toBe('lusha.com');
    expect(normalizeDomain('app.lusha.com:443/')).toBe('app.lusha.com');
  });

  it('should reject values that are not a domain', () => {
    expect(normalizeDomain('localhost')).toBeUndefined();
    expect(normalizeDomain(' ')).toBeUndefined();
    expect(normalizeDomain(42)).toBeUndefined();
  });
});

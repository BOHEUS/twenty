import { describe, expect, it } from 'vitest';

import { normalizeLinkedinUrl } from 'src/logic-functions/data/normalize-linkedin-url';

describe('normalizeLinkedinUrl', () => {
  it('should turn a LinkedIn profile into its canonical URL', () => {
    expect(normalizeLinkedinUrl('linkedin.com/in/orit-shilvock/')).toBe(
      'https://www.linkedin.com/in/orit-shilvock',
    );
    expect(
      normalizeLinkedinUrl('http://uk.linkedin.com/in/orit-shilvock?trk=x'),
    ).toBe('https://www.linkedin.com/in/orit-shilvock');
    expect(
      normalizeLinkedinUrl('https://www.linkedin.com/company/lushadata/about'),
    ).toBe('https://www.linkedin.com/company/lushadata');
  });

  it('should reject URLs that are not a LinkedIn profile', () => {
    expect(normalizeLinkedinUrl('https://twitter.com/lusha')).toBeUndefined();
    expect(normalizeLinkedinUrl('https://www.linkedin.com/')).toBeUndefined();
  });
});

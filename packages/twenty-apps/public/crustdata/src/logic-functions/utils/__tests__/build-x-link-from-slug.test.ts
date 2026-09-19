import { describe, expect, it } from 'vitest';

import { buildXLinkFromSlug } from 'src/logic-functions/utils/build-x-link-from-slug';

describe('buildXLinkFromSlug', () => {
  it('builds a URL from a bare handle', () => {
    expect(buildXLinkFromSlug('ada')).toEqual({
      primaryLinkUrl: 'https://x.com/ada',
      primaryLinkLabel: '@ada',
      secondaryLinks: null,
    });
  });

  it('strips a leading at sign', () => {
    expect(buildXLinkFromSlug('@ada')?.primaryLinkUrl).toBe('https://x.com/ada');
  });

  it('returns undefined without a handle', () => {
    expect(buildXLinkFromSlug(null)).toBeUndefined();
    expect(buildXLinkFromSlug('  ')).toBeUndefined();
  });
});

import { describe, expect, it } from 'vitest';

import { sanitizeDomain } from 'src/logic-functions/utils/sanitize-domain.util';

describe('sanitizeDomain', () => {
  it.each([
    ['example.com', 'example.com'],
    ['https://www.example.com', 'example.com'],
    ['http://example.com/careers?utm=x', 'example.com'],
    ['WWW.Example.COM', 'example.com'],
    ['https://blog.example.com/posts#latest', 'blog.example.com'],
    ['  example.com  ', 'example.com'],
  ])('should reduce %s to %s', (input, expected) => {
    expect(sanitizeDomain(input)).toBe(expected);
  });

  it('should return an empty string for a missing value', () => {
    expect(sanitizeDomain(undefined)).toBe('');
    expect(sanitizeDomain(null)).toBe('');
    expect(sanitizeDomain('')).toBe('');
  });
});

import { isTimingSafeEqual } from '@/sdk/logic-function/webhooks/is-timing-safe-equal';

describe('isTimingSafeEqual', () => {
  it('matches identical strings', () => {
    expect(isTimingSafeEqual('secret', 'secret')).toBe(true);
  });

  it('matches a buffer against its string form', () => {
    expect(isTimingSafeEqual(Buffer.from('secret'), 'secret')).toBe(true);
  });

  it('rejects different values of the same length', () => {
    expect(isTimingSafeEqual('secret', 'secreT')).toBe(false);
  });

  it('rejects values of different lengths', () => {
    expect(isTimingSafeEqual('secret', 'secrets')).toBe(false);
    expect(isTimingSafeEqual('', 'a')).toBe(false);
  });
});

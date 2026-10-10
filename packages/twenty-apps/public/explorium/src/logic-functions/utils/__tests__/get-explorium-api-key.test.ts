import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { getExploriumApiKey } from 'src/logic-functions/utils/get-explorium-api-key';
import { ExploriumConfigError } from 'src/logic-functions/errors/explorium-config-error';

describe('getExploriumApiKey', () => {
  let previousApiKey: string | undefined;

  beforeEach(() => {
    previousApiKey = process.env.EXPLORIUM_API_KEY;
  });

  afterEach(() => {
    if (previousApiKey === undefined) {
      delete process.env.EXPLORIUM_API_KEY;
    } else {
      process.env.EXPLORIUM_API_KEY = previousApiKey;
    }
  });

  it('returns the configured key', () => {
    process.env.EXPLORIUM_API_KEY = 'secret-key';

    expect(getExploriumApiKey()).toBe('secret-key');
  });

  it('throws a ExploriumConfigError when the key is missing', () => {
    delete process.env.EXPLORIUM_API_KEY;

    expect(() => getExploriumApiKey()).toThrow(ExploriumConfigError);
  });

  it('throws a ExploriumConfigError when the key is blank', () => {
    process.env.EXPLORIUM_API_KEY = '   ';

    expect(() => getExploriumApiKey()).toThrow(ExploriumConfigError);
  });
});

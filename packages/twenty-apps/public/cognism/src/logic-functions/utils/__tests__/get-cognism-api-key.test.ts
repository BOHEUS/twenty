import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { getCognismApiKey } from 'src/logic-functions/utils/get-cognism-api-key';
import { CognismConfigError } from 'src/logic-functions/errors/cognism-config-error';

describe('getCognismApiKey', () => {
  let previousApiKey: string | undefined;

  beforeEach(() => {
    previousApiKey = process.env.COGNISM_API_KEY;
  });

  afterEach(() => {
    if (previousApiKey === undefined) {
      delete process.env.COGNISM_API_KEY;
    } else {
      process.env.COGNISM_API_KEY = previousApiKey;
    }
  });

  it('returns the configured key', () => {
    process.env.COGNISM_API_KEY = 'secret-key';

    expect(getCognismApiKey()).toBe('secret-key');
  });

  it('throws a CognismConfigError when the key is missing', () => {
    delete process.env.COGNISM_API_KEY;

    expect(() => getCognismApiKey()).toThrow(CognismConfigError);
  });

  it('throws a CognismConfigError when the key is blank', () => {
    process.env.COGNISM_API_KEY = '   ';

    expect(() => getCognismApiKey()).toThrow(CognismConfigError);
  });
});

import { afterEach, describe, expect, it } from 'vitest';

import { ROCKETREACH_API_KEY_VARIABLE_NAME } from 'src/constants/server-variable-names';
import { RocketReachConfigError } from 'src/logic-functions/errors/rocketreach-config-error';
import { getRocketReachApiKey } from 'src/logic-functions/utils/get-rocketreach-api-key';

afterEach(() => {
  delete process.env[ROCKETREACH_API_KEY_VARIABLE_NAME];
});

describe('getRocketReachApiKey', () => {
  it('returns the trimmed key', () => {
    process.env[ROCKETREACH_API_KEY_VARIABLE_NAME] = '  secret-key  ';

    expect(getRocketReachApiKey()).toBe('secret-key');
  });

  it('throws when the key is missing or blank', () => {
    expect(() => getRocketReachApiKey()).toThrow(RocketReachConfigError);

    process.env[ROCKETREACH_API_KEY_VARIABLE_NAME] = '   ';
    expect(() => getRocketReachApiKey()).toThrow(RocketReachConfigError);
  });
});

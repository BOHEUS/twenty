import { afterEach, describe, expect, it } from 'vitest';

import { DEFAULT_LOOKUP_CONCURRENCY } from 'src/constants/lookup-concurrency';
import { LOOKUP_CONCURRENCY_VARIABLE_NAME } from 'src/constants/server-variable-names';
import { RocketReachConfigError } from 'src/logic-functions/errors/rocketreach-config-error';
import { resolveLookupConcurrency } from 'src/logic-functions/utils/resolve-lookup-concurrency';

afterEach(() => {
  delete process.env[LOOKUP_CONCURRENCY_VARIABLE_NAME];
});

describe('resolveLookupConcurrency', () => {
  it('defaults when the variable is unset', () => {
    expect(resolveLookupConcurrency()).toBe(DEFAULT_LOOKUP_CONCURRENCY);
  });

  it('accepts a value inside the RocketReach rate ceiling', () => {
    process.env[LOOKUP_CONCURRENCY_VARIABLE_NAME] = '8';

    expect(resolveLookupConcurrency()).toBe(8);
  });

  it('rejects a value above the ten requests per second ceiling', () => {
    process.env[LOOKUP_CONCURRENCY_VARIABLE_NAME] = '25';

    expect(() => resolveLookupConcurrency()).toThrow(RocketReachConfigError);
  });

  it('rejects a non-integer value', () => {
    process.env[LOOKUP_CONCURRENCY_VARIABLE_NAME] = 'many';

    expect(() => resolveLookupConcurrency()).toThrow(RocketReachConfigError);
  });
});

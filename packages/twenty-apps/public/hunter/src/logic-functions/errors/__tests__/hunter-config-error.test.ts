import { describe, expect, it } from 'vitest';

import { HunterConfigError } from 'src/logic-functions/errors/hunter-config-error';
import { HunterError } from 'src/logic-functions/errors/hunter-error';

describe('HunterConfigError', () => {
  it('is a HunterError with a dedicated name, code, and the given message', () => {
    const error = new HunterConfigError('missing key');

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(HunterError);
    expect(error.name).toBe('HunterConfigError');
    expect(error.code).toBe('CONFIGURATION');
    expect(error.message).toBe('missing key');
  });
});

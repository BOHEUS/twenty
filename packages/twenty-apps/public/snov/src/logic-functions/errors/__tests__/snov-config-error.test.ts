import { describe, expect, it } from 'vitest';

import { SnovConfigError } from 'src/logic-functions/errors/snov-config-error';
import { SnovError } from 'src/logic-functions/errors/snov-error';

describe('SnovConfigError', () => {
  it('is a SnovError with a dedicated name, code, and the given message', () => {
    const error = new SnovConfigError('missing key');

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(SnovError);
    expect(error.name).toBe('SnovConfigError');
    expect(error.code).toBe('CONFIGURATION');
    expect(error.message).toBe('missing key');
  });
});

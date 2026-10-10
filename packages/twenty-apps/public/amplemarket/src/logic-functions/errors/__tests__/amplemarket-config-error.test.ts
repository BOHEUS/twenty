import { describe, expect, it } from 'vitest';

import { AmplemarketConfigError } from 'src/logic-functions/errors/amplemarket-config-error';
import { AmplemarketError } from 'src/logic-functions/errors/amplemarket-error';

describe('AmplemarketConfigError', () => {
  it('is a AmplemarketError with a dedicated name, code, and the given message', () => {
    const error = new AmplemarketConfigError('missing key');

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AmplemarketError);
    expect(error.name).toBe('AmplemarketConfigError');
    expect(error.code).toBe('CONFIGURATION');
    expect(error.message).toBe('missing key');
  });
});

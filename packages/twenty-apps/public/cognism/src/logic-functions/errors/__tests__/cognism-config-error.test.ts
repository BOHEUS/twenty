import { describe, expect, it } from 'vitest';

import { CognismConfigError } from 'src/logic-functions/errors/cognism-config-error';
import { CognismError } from 'src/logic-functions/errors/cognism-error';

describe('CognismConfigError', () => {
  it('is a CognismError with a dedicated name, code, and the given message', () => {
    const error = new CognismConfigError('missing key');

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(CognismError);
    expect(error.name).toBe('CognismConfigError');
    expect(error.code).toBe('CONFIGURATION');
    expect(error.message).toBe('missing key');
  });
});

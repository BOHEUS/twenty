import { describe, expect, it } from 'vitest';

import { CognismError } from 'src/logic-functions/errors/cognism-error';
import { CognismInvalidInputError } from 'src/logic-functions/errors/cognism-invalid-input-error';

describe('CognismInvalidInputError', () => {
  it('is a CognismError with a dedicated name, code, and the given message', () => {
    const error = new CognismInvalidInputError('recordId is required');

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(CognismError);
    expect(error.name).toBe('CognismInvalidInputError');
    expect(error.code).toBe('INVALID_INPUT');
    expect(error.message).toBe('recordId is required');
  });
});

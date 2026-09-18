import { describe, expect, it } from 'vitest';

import { CognismError } from 'src/logic-functions/errors/cognism-error';
import { CognismOperationError } from 'src/logic-functions/errors/cognism-operation-error';

describe('CognismOperationError', () => {
  it('is a CognismError with a dedicated name, code, and the given message', () => {
    const error = new CognismOperationError('no id returned');

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(CognismError);
    expect(error.name).toBe('CognismOperationError');
    expect(error.code).toBe('OPERATION_FAILED');
    expect(error.message).toBe('no id returned');
  });
});

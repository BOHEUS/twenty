import { describe, expect, it } from 'vitest';

import { SnovError } from 'src/logic-functions/errors/snov-error';
import { SnovOperationError } from 'src/logic-functions/errors/snov-operation-error';

describe('SnovOperationError', () => {
  it('is a SnovError with a dedicated name, code, and the given message', () => {
    const error = new SnovOperationError('no id returned');

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(SnovError);
    expect(error.name).toBe('SnovOperationError');
    expect(error.code).toBe('OPERATION_FAILED');
    expect(error.message).toBe('no id returned');
  });
});

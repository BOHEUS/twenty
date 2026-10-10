import { describe, expect, it } from 'vitest';

import { HunterError } from 'src/logic-functions/errors/hunter-error';
import { HunterOperationError } from 'src/logic-functions/errors/hunter-operation-error';

describe('HunterOperationError', () => {
  it('is a HunterError with a dedicated name, code, and the given message', () => {
    const error = new HunterOperationError('no id returned');

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(HunterError);
    expect(error.name).toBe('HunterOperationError');
    expect(error.code).toBe('OPERATION_FAILED');
    expect(error.message).toBe('no id returned');
  });
});

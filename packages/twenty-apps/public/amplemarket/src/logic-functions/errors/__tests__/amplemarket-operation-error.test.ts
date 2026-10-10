import { describe, expect, it } from 'vitest';

import { AmplemarketError } from 'src/logic-functions/errors/amplemarket-error';
import { AmplemarketOperationError } from 'src/logic-functions/errors/amplemarket-operation-error';

describe('AmplemarketOperationError', () => {
  it('is a AmplemarketError with a dedicated name, code, and the given message', () => {
    const error = new AmplemarketOperationError('no id returned');

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AmplemarketError);
    expect(error.name).toBe('AmplemarketOperationError');
    expect(error.code).toBe('OPERATION_FAILED');
    expect(error.message).toBe('no id returned');
  });
});

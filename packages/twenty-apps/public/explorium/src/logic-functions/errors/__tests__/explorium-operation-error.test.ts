import { describe, expect, it } from 'vitest';

import { ExploriumError } from 'src/logic-functions/errors/explorium-error';
import { ExploriumOperationError } from 'src/logic-functions/errors/explorium-operation-error';

describe('ExploriumOperationError', () => {
  it('is a ExploriumError with a dedicated name, code, and the given message', () => {
    const error = new ExploriumOperationError('no id returned');

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ExploriumError);
    expect(error.name).toBe('ExploriumOperationError');
    expect(error.code).toBe('OPERATION_FAILED');
    expect(error.message).toBe('no id returned');
  });
});

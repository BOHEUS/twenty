import { describe, expect, it } from 'vitest';

import { DropcontactError } from 'src/logic-functions/errors/dropcontact-error';
import { DropcontactOperationError } from 'src/logic-functions/errors/dropcontact-operation-error';

describe('DropcontactOperationError', () => {
  it('is a DropcontactError with a dedicated name, code, and the given message', () => {
    const error = new DropcontactOperationError('no id returned');

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(DropcontactError);
    expect(error.name).toBe('DropcontactOperationError');
    expect(error.code).toBe('OPERATION_FAILED');
    expect(error.message).toBe('no id returned');
  });
});

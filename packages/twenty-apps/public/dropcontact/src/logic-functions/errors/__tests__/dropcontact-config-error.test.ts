import { describe, expect, it } from 'vitest';

import { DropcontactConfigError } from 'src/logic-functions/errors/dropcontact-config-error';
import { DropcontactError } from 'src/logic-functions/errors/dropcontact-error';

describe('DropcontactConfigError', () => {
  it('is a DropcontactError with a dedicated name, code, and the given message', () => {
    const error = new DropcontactConfigError('missing key');

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(DropcontactError);
    expect(error.name).toBe('DropcontactConfigError');
    expect(error.code).toBe('CONFIGURATION');
    expect(error.message).toBe('missing key');
  });
});

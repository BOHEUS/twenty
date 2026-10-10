import { describe, expect, it } from 'vitest';

import { ExploriumConfigError } from 'src/logic-functions/errors/explorium-config-error';
import { ExploriumError } from 'src/logic-functions/errors/explorium-error';

describe('ExploriumConfigError', () => {
  it('is a ExploriumError with a dedicated name, code, and the given message', () => {
    const error = new ExploriumConfigError('missing key');

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ExploriumError);
    expect(error.name).toBe('ExploriumConfigError');
    expect(error.code).toBe('CONFIGURATION');
    expect(error.message).toBe('missing key');
  });
});

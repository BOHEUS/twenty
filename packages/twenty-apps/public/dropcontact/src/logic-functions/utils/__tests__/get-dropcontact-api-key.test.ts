import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { getDropcontactApiKey } from 'src/logic-functions/utils/get-dropcontact-api-key';
import { DropcontactConfigError } from 'src/logic-functions/errors/dropcontact-config-error';

describe('getDropcontactApiKey', () => {
  let previousApiKey: string | undefined;

  beforeEach(() => {
    previousApiKey = process.env.DROPCONTACT_API_KEY;
  });

  afterEach(() => {
    if (previousApiKey === undefined) {
      delete process.env.DROPCONTACT_API_KEY;
    } else {
      process.env.DROPCONTACT_API_KEY = previousApiKey;
    }
  });

  it('returns the configured key', () => {
    process.env.DROPCONTACT_API_KEY = 'secret-key';

    expect(getDropcontactApiKey()).toBe('secret-key');
  });

  it('throws a DropcontactConfigError when the key is missing', () => {
    delete process.env.DROPCONTACT_API_KEY;

    expect(() => getDropcontactApiKey()).toThrow(DropcontactConfigError);
  });

  it('throws a DropcontactConfigError when the key is blank', () => {
    process.env.DROPCONTACT_API_KEY = '   ';

    expect(() => getDropcontactApiKey()).toThrow(DropcontactConfigError);
  });
});

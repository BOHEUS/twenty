import { describe, expect, it } from 'vitest';

import { extractAmplemarketErrorMessage } from 'src/logic-functions/utils/extract-amplemarket-error-message';

describe('extractAmplemarketErrorMessage', () => {
  it('reads the detail of each error, falling back to its title', () => {
    expect(
      extractAmplemarketErrorMessage({
        json: {
          object: 'error',
          _errors: [
            {
              code: 'missing_field',
              detail: 'Must provide either domain or linkedin_url',
            },
            { code: 'unsupported_value', title: 'Unsupported Value' },
          ],
        },
        httpStatus: 400,
      }),
    ).toBe('Must provide either domain or linkedin_url; Unsupported Value');
  });

  it('falls back to a generic message when none is present', () => {
    expect(extractAmplemarketErrorMessage({ json: {}, httpStatus: 503 })).toBe(
      'Amplemarket request failed (HTTP 503).',
    );
  });
});

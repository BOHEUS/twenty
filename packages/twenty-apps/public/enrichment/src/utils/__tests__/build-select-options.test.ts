import { describe, expect, it } from 'vitest';

import { buildSelectOptions } from 'src/utils/build-select-options';

describe('buildSelectOptions', () => {
  it('gives each option its identifier and list position', () => {
    expect(
      buildSelectOptions({
        options: [
          { value: 'VALID', label: 'Valid', color: 'green' },
          { value: 'INVALID', label: 'Invalid', color: 'red' },
        ],
        ids: { VALID: 'valid-id', INVALID: 'invalid-id' },
      }),
    ).toEqual([
      {
        value: 'VALID',
        label: 'Valid',
        color: 'green',
        id: 'valid-id',
        position: 0,
      },
      {
        value: 'INVALID',
        label: 'Invalid',
        color: 'red',
        id: 'invalid-id',
        position: 1,
      },
    ]);
  });
});

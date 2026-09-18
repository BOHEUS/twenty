import { describe, expect, it } from 'vitest';

import { pickSelect } from 'src/logic-functions/utils/pick-select';

const ROLES = new Set(['ENGINEERING', 'SALES']);
const LEVELS = new Set(['C_LEVEL', 'VP_LEVEL']);

describe('pickSelect', () => {
  it('normalizes and returns an allowed value', () => {
    expect(pickSelect({ raw: 'engineering', allowedValues: ROLES })).toBe(
      'ENGINEERING',
    );
  });

  it('returns undefined for a value outside the option set', () => {
    expect(
      pickSelect({ raw: 'marketing', allowedValues: ROLES }),
    ).toBeUndefined();
  });

  it('returns undefined for empty or non-string input', () => {
    expect(pickSelect({ raw: '', allowedValues: ROLES })).toBeUndefined();
    expect(
      pickSelect({ raw: undefined, allowedValues: ROLES }),
    ).toBeUndefined();
  });

  it('normalizes punctuation in the raw value before checking the option set', () => {
    expect(pickSelect({ raw: 'C-Level', allowedValues: LEVELS })).toBe(
      'C_LEVEL',
    );
  });

  it('applies a custom transform before checking the option set', () => {
    expect(
      pickSelect({
        raw: 'vp',
        allowedValues: LEVELS,
        transform: () => 'VP_LEVEL',
      }),
    ).toBe('VP_LEVEL');
  });
});

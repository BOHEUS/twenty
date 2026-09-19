import { describe, expect, it } from 'vitest';

import { dedupeIdentifiers } from 'src/logic-functions/utils/dedupe-identifiers';

describe('dedupeIdentifiers', () => {
  it('collapses identifiers that differ only in case, keeping the first spelling', () => {
    expect(
      dedupeIdentifiers([
        'https://www.linkedin.com/in/AdaLovelace',
        'https://www.linkedin.com/in/adalovelace',
      ]),
    ).toEqual(['https://www.linkedin.com/in/AdaLovelace']);
  });

  it('keeps distinct identifiers', () => {
    expect(dedupeIdentifiers(['a.com', 'b.com'])).toEqual(['a.com', 'b.com']);
  });
});

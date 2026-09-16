import { describe, expect, it } from 'vitest';

import { chunk } from 'src/logic-functions/data/chunk';

describe('chunk', () => {
  it('should split items into batches of the given size', () => {
    expect(chunk({ items: [1, 2, 3, 4, 5], size: 2 })).toEqual([
      [1, 2],
      [3, 4],
      [5],
    ]);
  });

  it('should return no batch for an empty list', () => {
    expect(chunk({ items: [], size: 10 })).toEqual([]);
  });

  it('should keep a list shorter than the size in a single batch', () => {
    expect(chunk({ items: ['a'], size: 10 })).toEqual([['a']]);
  });
});

import { describe, expect, it } from 'vitest';

import { extractConnectionNodes } from 'src/logic-functions/utils/extract-connection-nodes';

describe('extractConnectionNodes', () => {
  it('returns the node of every edge', () => {
    expect(
      extractConnectionNodes({
        edges: [{ node: { id: 'a' } }, { node: { id: 'b' } }],
      }),
    ).toEqual([{ id: 'a' }, { id: 'b' }]);
  });

  it('returns an empty list when the connection is missing or malformed', () => {
    expect(extractConnectionNodes(undefined)).toEqual([]);
    expect(extractConnectionNodes({})).toEqual([]);
    expect(extractConnectionNodes({ edges: 'nope' })).toEqual([]);
  });

  it('drops edges without a usable node id', () => {
    expect(
      extractConnectionNodes({
        edges: [{ node: { id: '' } }, { node: null }, { node: { id: 'a' } }],
      }),
    ).toEqual([{ id: 'a' }]);
  });
});

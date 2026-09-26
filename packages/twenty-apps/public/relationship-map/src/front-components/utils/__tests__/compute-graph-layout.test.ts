import { describe, expect, it } from 'vitest';

import { type GraphNode } from 'src/front-components/types/relationship-graph.type';
import { NODE_RADIUS } from 'src/front-components/constants/node-radius';
import { computeGraphLayout } from 'src/front-components/utils/compute-graph-layout';

const node = (id: string): GraphNode => ({
  id,
  name: id,
  jobTitle: '',
  isFocused: false,
});

const distance = (
  first: { x: number; y: number },
  second: { x: number; y: number },
) => Math.hypot(first.x - second.x, first.y - second.y);

describe('computeGraphLayout', () => {
  const nodes = ['a', 'b', 'c', 'd', 'e'].map(node);
  const edges = [
    { id: 'ab', sourceId: 'a', targetId: 'b', relationshipType: null },
    { id: 'bc', sourceId: 'b', targetId: 'c', relationshipType: null },
    { id: 'ca', sourceId: 'c', targetId: 'a', relationshipType: null },
  ];

  it('positions every node without overlaps', () => {
    const { positionsById } = computeGraphLayout({ nodes, edges });

    expect([...positionsById.keys()]).toEqual(['a', 'b', 'c', 'd', 'e']);

    const positions = [...positionsById.values()];

    for (const [index, position] of positions.entries()) {
      expect(Number.isFinite(position.x)).toBe(true);
      expect(Number.isFinite(position.y)).toBe(true);

      for (const otherPosition of positions.slice(index + 1)) {
        expect(distance(position, otherPosition)).toBeGreaterThan(
          2 * NODE_RADIUS,
        );
      }
    }
  });

  it('fits every node inside the view box', () => {
    const { positionsById, viewBox } = computeGraphLayout({ nodes, edges });

    for (const { x, y } of positionsById.values()) {
      expect(x - NODE_RADIUS).toBeGreaterThanOrEqual(viewBox.x);
      expect(x + NODE_RADIUS).toBeLessThanOrEqual(viewBox.x + viewBox.width);
      expect(y - NODE_RADIUS).toBeGreaterThanOrEqual(viewBox.y);
      expect(y + NODE_RADIUS).toBeLessThanOrEqual(viewBox.y + viewBox.height);
    }
  });

  it('returns the same layout for the same graph', () => {
    expect(computeGraphLayout({ nodes, edges })).toEqual(
      computeGraphLayout({ nodes, edges }),
    );
  });
});

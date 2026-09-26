import { describe, expect, it } from 'vitest';

import { computeEdgeGeometry } from 'src/front-components/utils/compute-edge-geometry';
import { NODE_RADIUS } from 'src/front-components/constants/node-radius';

describe('computeEdgeGeometry', () => {
  const left = { x: 0, y: 0 };
  const right = { x: 200, y: 0 };

  it('bows opposite edges to opposite sides so they do not overlap', () => {
    const forward = computeEdgeGeometry(left, right);
    const backward = computeEdgeGeometry(right, left);

    expect(forward.labelPosition.y).toBeGreaterThan(0);
    expect(backward.labelPosition.y).toBeLessThan(0);
  });

  it('puts the arrow tip on the edge of the target node', () => {
    const { arrowPoints } = computeEdgeGeometry(left, right);
    const [arrowTipX, arrowTipY] = arrowPoints.split(' ')[0].split(',').map(Number);

    expect(Math.hypot(arrowTipX - right.x, arrowTipY - right.y)).toBeCloseTo(
      NODE_RADIUS,
    );
  });
});

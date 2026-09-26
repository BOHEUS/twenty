import { NODE_RADIUS } from 'src/front-components/constants/node-radius';
import { type GraphPosition } from 'src/front-components/types/relationship-graph.type';

// Bowing every edge to its right keeps A→B and B→A apart instead of overlapping
const EDGE_CURVATURE = 0.12;
const ARROW_LENGTH = 9;
const ARROW_HALF_WIDTH = 4.5;

const moveTowards = (
  from: GraphPosition,
  to: GraphPosition,
  distance: number,
): GraphPosition => {
  const length = Math.hypot(to.x - from.x, to.y - from.y) || 1;

  return {
    x: from.x + ((to.x - from.x) / length) * distance,
    y: from.y + ((to.y - from.y) / length) * distance,
  };
};

export type EdgeGeometry = {
  path: string;
  arrowPoints: string;
  labelPosition: GraphPosition;
};

export const computeEdgeGeometry = (
  source: GraphPosition,
  target: GraphPosition,
): EdgeGeometry => {
  const control = {
    x: (source.x + target.x) / 2 - (target.y - source.y) * EDGE_CURVATURE,
    y: (source.y + target.y) / 2 + (target.x - source.x) * EDGE_CURVATURE,
  };

  const start = moveTowards(source, control, NODE_RADIUS);
  const arrowTip = moveTowards(target, control, NODE_RADIUS);
  const arrowBase = moveTowards(arrowTip, control, ARROW_LENGTH);
  const baseLength =
    Math.hypot(arrowTip.x - arrowBase.x, arrowTip.y - arrowBase.y) || 1;
  const perpendicularX =
    (-(arrowTip.y - arrowBase.y) / baseLength) * ARROW_HALF_WIDTH;
  const perpendicularY =
    ((arrowTip.x - arrowBase.x) / baseLength) * ARROW_HALF_WIDTH;

  return {
    path: `M ${start.x} ${start.y} Q ${control.x} ${control.y} ${arrowBase.x} ${arrowBase.y}`,
    arrowPoints: [
      `${arrowTip.x},${arrowTip.y}`,
      `${arrowBase.x + perpendicularX},${arrowBase.y + perpendicularY}`,
      `${arrowBase.x - perpendicularX},${arrowBase.y - perpendicularY}`,
    ].join(' '),
    // Point at t = 0.5 on the quadratic curve
    labelPosition: {
      x: (start.x + 2 * control.x + arrowBase.x) / 4,
      y: (start.y + 2 * control.y + arrowBase.y) / 4,
    },
  };
};

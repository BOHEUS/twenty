import {
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  type SimulationLinkDatum,
  type SimulationNodeDatum,
} from 'd3-force';

import {
  type GraphPosition,
  type RelationshipGraph,
} from 'src/front-components/types/relationship-graph.type';
import {
  computeFitViewBox,
  type ViewBox,
} from 'src/front-components/utils/graph-viewport';

const LINK_DISTANCE = 160;
const CHARGE_STRENGTH = -600;
// Wide enough to keep the name and job title under each node from overlapping
const COLLISION_RADIUS = 70;
// Pulls disconnected groups toward the center so they don't drift off-screen
const CENTERING_STRENGTH = 0.06;
const SIMULATION_TICKS = 300;

type LayoutNode = SimulationNodeDatum & { id: string };

export type GraphLayout = {
  positionsById: Map<string, GraphPosition>;
  viewBox: ViewBox;
};

export const computeGraphLayout = ({
  nodes,
  edges,
}: Pick<RelationshipGraph, 'nodes' | 'edges'>): GraphLayout => {
  const layoutNodes: LayoutNode[] = nodes.map(({ id }) => ({ id }));
  const layoutLinks: SimulationLinkDatum<LayoutNode>[] = edges.map(
    ({ sourceId, targetId }) => ({ source: sourceId, target: targetId }),
  );

  forceSimulation(layoutNodes)
    .force(
      'link',
      forceLink<LayoutNode, SimulationLinkDatum<LayoutNode>>(layoutLinks)
        .id((layoutNode) => layoutNode.id)
        .distance(LINK_DISTANCE),
    )
    .force('charge', forceManyBody().strength(CHARGE_STRENGTH))
    .force('collide', forceCollide(COLLISION_RADIUS))
    .force('x', forceX(0).strength(CENTERING_STRENGTH))
    .force('y', forceY(0).strength(CENTERING_STRENGTH))
    .stop()
    .tick(SIMULATION_TICKS);

  const positionsById = new Map<string, GraphPosition>(
    layoutNodes.map((layoutNode) => [
      layoutNode.id,
      { x: layoutNode.x ?? 0, y: layoutNode.y ?? 0 },
    ]),
  );

  return {
    positionsById,
    viewBox: computeFitViewBox(positionsById.values()),
  };
};

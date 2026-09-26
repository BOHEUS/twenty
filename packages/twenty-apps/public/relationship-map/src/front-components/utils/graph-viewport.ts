import { NODE_RADIUS } from 'src/front-components/constants/node-radius';
import {
  type GraphNode,
  type GraphPosition,
} from 'src/front-components/types/relationship-graph.type';

export const MIN_ZOOM = 0.25;
export const MAX_ZOOM = 4;

const HORIZONTAL_PADDING = 90;
const TOP_PADDING = NODE_RADIUS + 16;
const BOTTOM_PADDING = NODE_RADIUS + 48;

export type ViewBox = { x: number; y: number; width: number; height: number };

export type Viewport = { centerX: number; centerY: number; zoom: number };

export type ElementRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type ClientPoint = { clientX: number; clientY: number };

export const computeFitViewBox = (
  positions: Iterable<GraphPosition>,
): ViewBox => {
  const positionList = [...positions];

  if (positionList.length === 0) {
    return { x: -HORIZONTAL_PADDING, y: -TOP_PADDING, width: 2 * HORIZONTAL_PADDING, height: TOP_PADDING + BOTTOM_PADDING };
  }

  const xs = positionList.map(({ x }) => x);
  const ys = positionList.map(({ y }) => y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);

  return {
    x: minX - HORIZONTAL_PADDING,
    y: minY - TOP_PADDING,
    width: Math.max(...xs) - minX + 2 * HORIZONTAL_PADDING,
    height: Math.max(...ys) - minY + TOP_PADDING + BOTTOM_PADDING,
  };
};

export const getViewportFittingViewBox = (viewBox: ViewBox): Viewport => ({
  centerX: viewBox.x + viewBox.width / 2,
  centerY: viewBox.y + viewBox.height / 2,
  zoom: 1,
});

export const getViewBoxForViewport = (
  viewport: Viewport,
  fitViewBox: ViewBox,
): ViewBox => {
  const width = fitViewBox.width / viewport.zoom;
  const height = fitViewBox.height / viewport.zoom;

  return {
    x: viewport.centerX - width / 2,
    y: viewport.centerY - height / 2,
    width,
    height,
  };
};

export const zoomViewport = (viewport: Viewport, factor: number): Viewport => ({
  ...viewport,
  zoom: Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, viewport.zoom * factor)),
});

// The svg uses preserveAspectRatio="xMidYMid meet": the view box is scaled
// uniformly to fit the element and centered in it
export const getGraphUnitsPerPixel = (
  viewBox: ViewBox,
  rect: ElementRect,
): number | null =>
  rect.width > 0 && rect.height > 0
    ? Math.max(viewBox.width / rect.width, viewBox.height / rect.height)
    : null;

export const clientPointToGraphPoint = (
  { clientX, clientY }: ClientPoint,
  viewBox: ViewBox,
  rect: ElementRect,
): GraphPosition | null => {
  const graphUnitsPerPixel = getGraphUnitsPerPixel(viewBox, rect);

  if (graphUnitsPerPixel === null) {
    return null;
  }

  return {
    x:
      viewBox.x +
      viewBox.width / 2 +
      (clientX - (rect.left + rect.width / 2)) * graphUnitsPerPixel,
    y:
      viewBox.y +
      viewBox.height / 2 +
      (clientY - (rect.top + rect.height / 2)) * graphUnitsPerPixel,
  };
};

export const findNodeAtPoint = (
  nodes: GraphNode[],
  positionsById: Map<string, GraphPosition>,
  point: GraphPosition,
): GraphNode | undefined =>
  // Last drawn node is on top, so it wins when nodes overlap
  [...nodes].reverse().find((node) => {
    const position = positionsById.get(node.id);

    return (
      position !== undefined &&
      Math.hypot(position.x - point.x, position.y - point.y) <= NODE_RADIUS
    );
  });

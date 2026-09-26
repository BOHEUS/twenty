import { type KeyboardEvent, type PointerEvent, useRef, useState } from 'react';
import { AppPath, navigate, t } from 'twenty-sdk/front-component';
import { IconFocusCentered, IconMinus, IconPlus } from 'twenty-ui/icon';
import { useTheme } from 'twenty-ui/theme-constants';

import { RELATIONSHIP_TYPES } from 'src/constants/relationship-types';
import { GraphControlButton } from 'src/front-components/components/GraphControlButton';
import { NODE_RADIUS } from 'src/front-components/constants/node-radius';
import {
  type GraphNode,
  type RelationshipGraph,
} from 'src/front-components/types/relationship-graph.type';
import { computeEdgeGeometry } from 'src/front-components/utils/compute-edge-geometry';
import { type GraphLayout } from 'src/front-components/utils/compute-graph-layout';
import { getInitials } from 'src/front-components/utils/get-initials';
import {
  clientPointToGraphPoint,
  computeFitViewBox,
  findNodeAtPoint,
  getGraphUnitsPerPixel,
  getViewBoxForViewport,
  getViewportFittingViewBox,
  MAX_ZOOM,
  MIN_ZOOM,
  zoomViewport,
} from 'src/front-components/utils/graph-viewport';
import { truncateLabel } from 'src/front-components/utils/truncate-label';

const ZOOM_STEP = 1.25;
// Below this a press on a node is a click that opens the person, not a drag
const DRAG_THRESHOLD_PIXELS = 4;

type DragState = {
  nodeId: string | null;
  lastClientX: number;
  lastClientY: number;
  travelledPixels: number;
};

type RelationshipGraphCanvasProps = {
  graph: RelationshipGraph;
  layout: GraphLayout;
};

const openPersonRecord = (personId: string) =>
  navigate(AppPath.RecordShowPage, {
    objectNameSingular: 'person',
    objectRecordId: personId,
  });

export const RelationshipGraphCanvas = ({
  graph,
  layout,
}: RelationshipGraphCanvasProps) => {
  const theme = useTheme();
  const svgRef = useRef<SVGSVGElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const [positionsById, setPositionsById] = useState(layout.positionsById);
  const [fitViewBox, setFitViewBox] = useState(layout.viewBox);
  const [viewport, setViewport] = useState(() =>
    getViewportFittingViewBox(layout.viewBox),
  );
  const [isPanning, setIsPanning] = useState(false);

  const viewBox = getViewBoxForViewport(viewport, fitViewBox);

  const getSvgRect = () => svgRef.current?.getBoundingClientRect() ?? null;

  const handlePointerDown = (event: PointerEvent<SVGSVGElement>) => {
    const svgRect = getSvgRect();
    const pointerPosition =
      svgRect === null ? null : clientPointToGraphPoint(event, viewBox, svgRect);

    if (pointerPosition === null) {
      return;
    }

    const pressedNode = findNodeAtPoint(
      graph.nodes,
      positionsById,
      pointerPosition,
    );

    dragRef.current = {
      nodeId: pressedNode?.id ?? null,
      lastClientX: event.clientX,
      lastClientY: event.clientY,
      travelledPixels: 0,
    };
    setIsPanning(pressedNode === undefined);
  };

  const handlePointerMove = (event: PointerEvent<SVGSVGElement>) => {
    const drag = dragRef.current;
    const svgRect = getSvgRect();

    if (drag === null || svgRect === null) {
      return;
    }

    const graphUnitsPerPixel = getGraphUnitsPerPixel(viewBox, svgRect);
    const deltaClientX = event.clientX - drag.lastClientX;
    const deltaClientY = event.clientY - drag.lastClientY;

    drag.lastClientX = event.clientX;
    drag.lastClientY = event.clientY;
    drag.travelledPixels += Math.hypot(deltaClientX, deltaClientY);

    if (graphUnitsPerPixel === null) {
      return;
    }

    const deltaX = deltaClientX * graphUnitsPerPixel;
    const deltaY = deltaClientY * graphUnitsPerPixel;
    const draggedNodeId = drag.nodeId;

    if (draggedNodeId === null) {
      setViewport((previousViewport) => ({
        ...previousViewport,
        centerX: previousViewport.centerX - deltaX,
        centerY: previousViewport.centerY - deltaY,
      }));

      return;
    }

    if (drag.travelledPixels < DRAG_THRESHOLD_PIXELS) {
      return;
    }

    setPositionsById((previousPositionsById) => {
      const previousPosition = previousPositionsById.get(draggedNodeId);

      if (previousPosition === undefined) {
        return previousPositionsById;
      }

      return new Map(previousPositionsById).set(draggedNodeId, {
        x: previousPosition.x + deltaX,
        y: previousPosition.y + deltaY,
      });
    });
  };

  const endDrag = ({ isRelease }: { isRelease: boolean }) => {
    const drag = dragRef.current;

    dragRef.current = null;
    setIsPanning(false);

    if (
      isRelease &&
      drag !== null &&
      drag.nodeId !== null &&
      drag.travelledPixels < DRAG_THRESHOLD_PIXELS
    ) {
      openPersonRecord(drag.nodeId);
    }
  };

  const handleZoom = (factor: number) =>
    setViewport((previousViewport) => zoomViewport(previousViewport, factor));

  const handleFit = () => {
    const nextFitViewBox = computeFitViewBox(positionsById.values());

    setFitViewBox(nextFitViewBox);
    setViewport(getViewportFittingViewBox(nextFitViewBox));
  };

  const handleNodeKeyDown = (
    event: KeyboardEvent<SVGGElement>,
    node: GraphNode,
  ) => {
    if (event.key === 'Enter') {
      openPersonRecord(node.id);
    }
  };

  const getRelationshipTypeStyle = (relationshipType: string | null) => {
    const relationshipTypeDefinition = RELATIONSHIP_TYPES.find(
      ({ value }) => value === relationshipType,
    );

    return {
      label: relationshipTypeDefinition?.label ?? relationshipType ?? '',
      color: relationshipTypeDefinition
        ? theme.color[relationshipTypeDefinition.color]
        : theme.font.color.tertiary,
    };
  };

  const labelOutlineStyle = {
    paintOrder: 'stroke',
    stroke: theme.background.primary,
    strokeWidth: 4,
  };

  return (
    <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
      <svg
        ref={svgRef}
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
        preserveAspectRatio="xMidYMid meet"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={() => endDrag({ isRelease: true })}
        onPointerLeave={() => endDrag({ isRelease: false })}
        onPointerCancel={() => endDrag({ isRelease: false })}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          cursor: isPanning ? 'grabbing' : 'grab',
          // Keeps touch drags on the graph instead of scrolling the page
          touchAction: 'none',
          userSelect: 'none',
        }}
      >
        {graph.edges.map((edge) => {
          const sourcePosition = positionsById.get(edge.sourceId);
          const targetPosition = positionsById.get(edge.targetId);

          if (sourcePosition === undefined || targetPosition === undefined) {
            return null;
          }

          const { path, arrowPoints, labelPosition } = computeEdgeGeometry(
            sourcePosition,
            targetPosition,
          );
          const { label, color } = getRelationshipTypeStyle(
            edge.relationshipType,
          );

          return (
            <g key={edge.id}>
              <path
                d={path}
                style={{ fill: 'none', stroke: color, strokeWidth: 1.5 }}
              />
              <polygon points={arrowPoints} style={{ fill: color }} />
              {label !== '' && (
                <text
                  x={labelPosition.x}
                  y={labelPosition.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  style={{ fill: color, fontSize: 11, ...labelOutlineStyle }}
                >
                  {label}
                </text>
              )}
            </g>
          );
        })}
        {graph.nodes.map((node) => {
          const position = positionsById.get(node.id);

          if (position === undefined) {
            return null;
          }

          const name = node.name === '' ? t('Unnamed person') : node.name;

          return (
            <g
              key={node.id}
              role="link"
              tabIndex={0}
              aria-label={name}
              onKeyDown={(event) => handleNodeKeyDown(event, node)}
              style={{ cursor: 'pointer' }}
            >
              <title>{name}</title>
              <circle
                cx={position.x}
                cy={position.y}
                r={NODE_RADIUS}
                style={{
                  fill: node.isFocused
                    ? theme.accent.quaternary
                    : theme.background.tertiary,
                  stroke: node.isFocused
                    ? theme.color.blue
                    : theme.border.color.strong,
                  strokeWidth: 1.5,
                }}
              />
              <text
                x={position.x}
                y={position.y}
                textAnchor="middle"
                dominantBaseline="central"
                style={{
                  fill: node.isFocused
                    ? theme.color.blue
                    : theme.font.color.secondary,
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {getInitials(name)}
              </text>
              <text
                x={position.x}
                y={position.y + NODE_RADIUS + 16}
                textAnchor="middle"
                style={{
                  fill: theme.font.color.primary,
                  fontSize: 12,
                  fontWeight: 500,
                  ...labelOutlineStyle,
                }}
              >
                {truncateLabel(name)}
              </text>
              {node.jobTitle !== '' && (
                <text
                  x={position.x}
                  y={position.y + NODE_RADIUS + 30}
                  textAnchor="middle"
                  style={{
                    fill: theme.font.color.tertiary,
                    fontSize: 11,
                    ...labelOutlineStyle,
                  }}
                >
                  {truncateLabel(node.jobTitle)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <div
        style={{
          position: 'absolute',
          top: theme.spacing[2],
          right: theme.spacing[2],
          display: 'flex',
          gap: theme.spacing[1],
        }}
      >
        <GraphControlButton
          ariaLabel={t('Zoom in')}
          disabled={viewport.zoom >= MAX_ZOOM}
          onClick={() => handleZoom(ZOOM_STEP)}
        >
          <IconPlus size={16} />
        </GraphControlButton>
        <GraphControlButton
          ariaLabel={t('Zoom out')}
          disabled={viewport.zoom <= MIN_ZOOM}
          onClick={() => handleZoom(1 / ZOOM_STEP)}
        >
          <IconMinus size={16} />
        </GraphControlButton>
        <GraphControlButton
          ariaLabel={t('Fit to screen')}
          onClick={handleFit}
        >
          <IconFocusCentered size={16} />
        </GraphControlButton>
      </div>
    </div>
  );
};

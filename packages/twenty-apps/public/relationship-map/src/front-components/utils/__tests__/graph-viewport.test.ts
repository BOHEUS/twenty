import { describe, expect, it } from 'vitest';

import {
  clientPointToGraphPoint,
  findNodeAtPoint,
  getViewBoxForViewport,
  getViewportFittingViewBox,
  MAX_ZOOM,
  MIN_ZOOM,
  zoomViewport,
} from 'src/front-components/utils/graph-viewport';

const fitViewBox = { x: -100, y: -50, width: 200, height: 100 };

describe('graph viewport', () => {
  it('shows the fitted view box at zoom 1 and shrinks it when zooming in', () => {
    const viewport = getViewportFittingViewBox(fitViewBox);

    expect(getViewBoxForViewport(viewport, fitViewBox)).toEqual(fitViewBox);
    expect(
      getViewBoxForViewport({ ...viewport, zoom: 2 }, fitViewBox),
    ).toEqual({ x: -50, y: -25, width: 100, height: 50 });
  });

  it('clamps the zoom level', () => {
    const viewport = getViewportFittingViewBox(fitViewBox);

    expect(zoomViewport(viewport, 100).zoom).toBe(MAX_ZOOM);
    expect(zoomViewport(viewport, 0.001).zoom).toBe(MIN_ZOOM);
  });

  it('maps client coordinates into a letterboxed view box', () => {
    // A 400x400 element shows the 200x100 view box at 2px per unit, centered vertically
    const rect = { left: 10, top: 20, width: 400, height: 400 };

    expect(
      clientPointToGraphPoint({ clientX: 210, clientY: 220 }, fitViewBox, rect),
    ).toEqual({ x: 0, y: 0 });
    expect(
      clientPointToGraphPoint({ clientX: 10, clientY: 120 }, fitViewBox, rect),
    ).toEqual({ x: -100, y: -50 });
  });

  it('ignores pointers while the element has not been measured', () => {
    expect(
      clientPointToGraphPoint(
        { clientX: 5, clientY: 5 },
        fitViewBox,
        { left: 0, top: 0, width: 0, height: 0 },
      ),
    ).toBeNull();
  });

  it('finds the topmost node under a point', () => {
    const nodes = ['bottom', 'top'].map((id) => ({
      id,
      name: id,
      jobTitle: '',
      isFocused: false,
    }));
    const positionsById = new Map([
      ['bottom', { x: 0, y: 0 }],
      ['top', { x: 10, y: 0 }],
    ]);

    expect(findNodeAtPoint(nodes, positionsById, { x: 5, y: 0 })?.id).toBe(
      'top',
    );
    expect(findNodeAtPoint(nodes, positionsById, { x: 200, y: 0 })).toBe(
      undefined,
    );
  });
});

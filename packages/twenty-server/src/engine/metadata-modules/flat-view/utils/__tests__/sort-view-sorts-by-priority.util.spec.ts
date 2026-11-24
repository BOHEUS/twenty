import { sortViewSortsByPriority } from 'src/engine/metadata-modules/flat-view/utils/sort-view-sorts-by-priority.util';

describe('sortViewSortsByPriority', () => {
  it('orders sorts by position before creation time', () => {
    const viewSorts = [
      {
        id: 'second-sort',
        position: 1,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
      },
      {
        id: 'first-sort',
        position: 0,
        createdAt: new Date('2026-01-03T00:00:00.000Z'),
      },
    ];

    expect(sortViewSortsByPriority(viewSorts).map(({ id }) => id)).toEqual([
      'first-sort',
      'second-sort',
    ]);
  });

  it('gives the oldest sort highest priority when positions are equal', () => {
    const viewSorts = [
      {
        id: 'newest-sort',
        position: 0,
        createdAt: '2026-01-03T00:00:00.000Z',
      },
      {
        id: 'oldest-sort',
        position: 0,
        createdAt: '2026-01-01T00:00:00.000Z',
      },
      {
        id: 'middle-sort',
        position: 0,
        createdAt: '2026-01-02T00:00:00.000Z',
      },
    ];

    expect(sortViewSortsByPriority(viewSorts).map(({ id }) => id)).toEqual([
      'oldest-sort',
      'middle-sort',
      'newest-sort',
    ]);
  });

  it('orders sorts with equal position and creation time by ID', () => {
    const createdAt = new Date('2026-01-01T00:00:00.000Z');

    expect(
      sortViewSortsByPriority([
        { id: 'sort-b', position: 0, createdAt },
        { id: 'sort-a', position: 0, createdAt },
      ]).map(({ id }) => id),
    ).toEqual(['sort-a', 'sort-b']);
  });

  it('leaves the supplied array unchanged', () => {
    const viewSorts = [
      {
        id: 'second-sort',
        position: 1,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
      },
      {
        id: 'first-sort',
        position: 0,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
      },
    ];

    sortViewSortsByPriority(viewSorts);

    expect(viewSorts.map(({ id }) => id)).toEqual([
      'second-sort',
      'first-sort',
    ]);
  });
});

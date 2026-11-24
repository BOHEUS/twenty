export const sortViewSortsByPriority = <
  TViewSort extends { id: string; position: number; createdAt: Date | string },
>(
  viewSorts: TViewSort[],
): TViewSort[] =>
  [...viewSorts].sort(
    (firstViewSort, secondViewSort) =>
      firstViewSort.position - secondViewSort.position ||
      new Date(firstViewSort.createdAt).getTime() -
        new Date(secondViewSort.createdAt).getTime() ||
      firstViewSort.id.localeCompare(secondViewSort.id),
  );

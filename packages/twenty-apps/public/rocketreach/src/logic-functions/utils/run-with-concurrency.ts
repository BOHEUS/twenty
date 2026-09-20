export const runWithConcurrency = async <TItem, TResult>({
  items,
  concurrency,
  run,
}: {
  items: TItem[];
  concurrency: number;
  run: (item: TItem, index: number) => Promise<TResult>;
}): Promise<TResult[]> => {
  const results = new Array<TResult>(items.length);
  let nextIndex = 0;

  const worker = async (): Promise<void> => {
    while (nextIndex < items.length) {
      const index = nextIndex++;
      results[index] = await run(items[index], index);
    }
  };

  const workerCount = Math.min(Math.max(concurrency, 1), items.length);

  await Promise.all(Array.from({ length: workerCount }, worker));

  return results;
};

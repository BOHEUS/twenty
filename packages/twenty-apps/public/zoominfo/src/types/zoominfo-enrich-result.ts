export type ZoomInfoEnrichResult<TData> =
  | {
      outcome: 'matched';
      matchStatus: string;
      data: TData;
    }
  | { outcome: 'not_found'; matchStatus: string }
  | { outcome: 'error'; matchStatus?: string; message: string };

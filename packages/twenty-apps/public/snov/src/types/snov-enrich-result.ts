export type SnovEnrichResult<TData> =
  | { outcome: 'matched'; data: TData }
  | { outcome: 'not_found' }
  | { outcome: 'error'; httpStatus: number; message: string };

export type CognismEnrichResult<TData> =
  | { outcome: 'matched'; httpStatus: number; matchScore?: number; data: TData }
  | { outcome: 'not_found'; httpStatus: number }
  | { outcome: 'error'; httpStatus: number; message: string };

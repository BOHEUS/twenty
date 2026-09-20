export type RocketReachLookupResult<TData> =
  | { outcome: 'matched'; httpStatus: number; data: TData }
  | { outcome: 'pending'; httpStatus: number; profileId?: number; data: TData }
  | { outcome: 'not_found'; httpStatus: number }
  | { outcome: 'error'; httpStatus: number; message: string };

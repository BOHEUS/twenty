export type DropcontactEnrichResult<TData> =
  | { outcome: 'matched'; data: TData }
  | { outcome: 'not_found' }
  | { outcome: 'pending'; requestId: string }
  | { outcome: 'error'; httpStatus: number; message: string };

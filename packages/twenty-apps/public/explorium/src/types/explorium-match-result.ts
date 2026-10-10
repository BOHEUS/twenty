export type ExploriumMatchResult =
  | { outcome: 'matched'; id: string }
  | { outcome: 'not_found' }
  | { outcome: 'error'; httpStatus: number; message: string };

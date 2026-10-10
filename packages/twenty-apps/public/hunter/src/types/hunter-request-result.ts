export type HunterRequestResult =
  | { status: 'found'; json: Record<string, unknown> }
  | { status: 'not_found' }
  | { status: 'error'; httpStatus: number; message: string };

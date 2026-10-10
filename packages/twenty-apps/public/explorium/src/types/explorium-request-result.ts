export type ExploriumRequestResult =
  | { ok: true; json: Record<string, unknown> }
  | { ok: false; httpStatus: number; message: string };

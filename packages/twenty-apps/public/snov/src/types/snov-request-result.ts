export type SnovRequestResult =
  | { ok: true; httpStatus: number; json: Record<string, unknown> }
  | { ok: false; httpStatus: number; message: string };

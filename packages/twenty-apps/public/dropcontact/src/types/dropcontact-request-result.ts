export type DropcontactRequestResult =
  | { ok: true; httpStatus: number; json: Record<string, unknown> }
  | { ok: false; httpStatus: number; message: string };

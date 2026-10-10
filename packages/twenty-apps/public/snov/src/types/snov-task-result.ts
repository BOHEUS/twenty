export type SnovTaskResult =
  | { status: 'completed'; json: Record<string, unknown> }
  | { status: 'in_progress' }
  | { status: 'error'; httpStatus: number; message: string };

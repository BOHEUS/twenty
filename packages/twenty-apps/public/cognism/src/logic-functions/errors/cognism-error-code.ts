// The value and the type share a name on purpose: they occupy separate
// TypeScript declaration spaces, which oxlint 1.x does not model yet.
// oxlint-disable-next-line no-redeclare
export const CognismErrorCode = {
  CONFIGURATION: 'CONFIGURATION',
  INVALID_INPUT: 'INVALID_INPUT',
  RECORD_NOT_FOUND: 'RECORD_NOT_FOUND',
  OPERATION_FAILED: 'OPERATION_FAILED',
} as const;

export type CognismErrorCode =
  (typeof CognismErrorCode)[keyof typeof CognismErrorCode];

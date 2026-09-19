export const CrustdataErrorCode = {
  CONFIGURATION: 'CONFIGURATION',
  INVALID_INPUT: 'INVALID_INPUT',
  RECORD_NOT_FOUND: 'RECORD_NOT_FOUND',
  OPERATION_FAILED: 'OPERATION_FAILED',
} as const;

export type CrustdataErrorCode = (typeof CrustdataErrorCode)[keyof typeof CrustdataErrorCode];

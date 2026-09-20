export const RocketReachErrorCode = {
  CONFIGURATION: 'CONFIGURATION',
  INVALID_INPUT: 'INVALID_INPUT',
  OPERATION_FAILED: 'OPERATION_FAILED',
} as const;

export type RocketReachErrorCode =
  (typeof RocketReachErrorCode)[keyof typeof RocketReachErrorCode];

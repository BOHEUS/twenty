export type CrustdataEnrichResult<TData> =
  | {
      outcome: 'matched';
      httpStatus: number;
      confidenceScore?: number;
      data: TData;
    }
  | { outcome: 'not_found'; httpStatus: number }
  | { outcome: 'redacted'; httpStatus: number }
  | { outcome: 'error'; httpStatus: number; message: string };

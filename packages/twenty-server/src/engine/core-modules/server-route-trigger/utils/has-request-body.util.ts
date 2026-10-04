import { type Request } from 'express';
import { isDefined } from 'twenty-shared/utils';

export const hasRequestBody = (request: Request): boolean => {
  const contentLength = Number(request.headers['content-length']);

  return (
    (Number.isFinite(contentLength) && contentLength > 0) ||
    isDefined(request.headers['transfer-encoding'])
  );
};

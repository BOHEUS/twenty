import { isDefined } from 'twenty-sdk/utils';

import { toText } from 'src/logic-functions/data/to-text';
import { type LushaRateLimit } from 'src/logic-functions/types/lusha-rate-limit.type';

const readRequestsLeft = ({
  headers,
  headerName,
}: {
  headers: Headers;
  headerName: string;
}): number | undefined => {
  const headerValue = toText(headers.get(headerName));

  if (!isDefined(headerValue)) {
    return undefined;
  }

  const requestsLeft = Number(headerValue);

  return Number.isInteger(requestsLeft) && requestsLeft >= 0
    ? requestsLeft
    : undefined;
};

export const readLushaRateLimit = (headers: Headers): LushaRateLimit => ({
  minuteRequestsLeft: readRequestsLeft({
    headers,
    headerName: 'x-minute-requests-left',
  }),
  hourlyRequestsLeft: readRequestsLeft({
    headers,
    headerName: 'x-hourly-requests-left',
  }),
  dailyRequestsLeft: readRequestsLeft({
    headers,
    headerName: 'x-daily-requests-left',
  }),
});

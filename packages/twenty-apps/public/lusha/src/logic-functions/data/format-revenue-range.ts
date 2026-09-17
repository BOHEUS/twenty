import { isDefined } from 'twenty-sdk/utils';

import { toJsonObject } from 'src/logic-functions/data/to-json';
import { toNumber } from 'src/logic-functions/data/to-number';

const REVENUE_FORMAT = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

const formatRevenue = (revenue: number): string =>
  `$${REVENUE_FORMAT.format(revenue)}`;

export const formatRevenueRange = (range: unknown): string | undefined => {
  const rangeObject = toJsonObject(range);
  const min = toNumber(rangeObject?.min);
  const max = toNumber(rangeObject?.max);

  if (isDefined(min) && isDefined(max)) {
    return `${formatRevenue(min)}-${formatRevenue(max)}`;
  }

  if (isDefined(min)) {
    return `${formatRevenue(min)}+`;
  }

  return isDefined(max) ? `Up to ${formatRevenue(max)}` : undefined;
};

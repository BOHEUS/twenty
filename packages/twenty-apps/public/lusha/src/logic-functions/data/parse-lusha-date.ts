import { isDefined } from 'twenty-sdk/utils';

import { toText } from 'src/logic-functions/data/to-text';

const ISO_DATE_REGEX = /^(\d{4})-(\d{2})-(\d{2})/;
// Funding rounds come back as "Nov 10, 2021".
const MONTH_DAY_YEAR_REGEX = /^([A-Za-z]{3})[a-z]*\.? (\d{1,2}), (\d{4})$/;

const MONTH_NUMBER_BY_ABBREVIATION: Record<string, number> = {
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  may: 5,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  oct: 10,
  nov: 11,
  dec: 12,
};

const toIsoDate = ({
  year,
  month,
  day,
}: {
  year: number;
  month: number;
  day: number;
}): string | undefined => {
  const date = new Date(Date.UTC(year, month - 1, day));

  const isRealCalendarDate =
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day;

  return isRealCalendarDate ? date.toISOString().slice(0, 10) : undefined;
};

export const parseLushaDate = (value: unknown): string | undefined => {
  const text = toText(value);

  if (!isDefined(text)) {
    return undefined;
  }

  const isoDateMatch = text.match(ISO_DATE_REGEX);

  if (isDefined(isoDateMatch)) {
    return toIsoDate({
      year: Number(isoDateMatch[1]),
      month: Number(isoDateMatch[2]),
      day: Number(isoDateMatch[3]),
    });
  }

  const monthDayYearMatch = text.match(MONTH_DAY_YEAR_REGEX);
  const month = isDefined(monthDayYearMatch)
    ? MONTH_NUMBER_BY_ABBREVIATION[monthDayYearMatch[1].toLowerCase()]
    : undefined;

  if (!isDefined(monthDayYearMatch) || !isDefined(month)) {
    return undefined;
  }

  return toIsoDate({
    year: Number(monthDayYearMatch[3]),
    month,
    day: Number(monthDayYearMatch[2]),
  });
};

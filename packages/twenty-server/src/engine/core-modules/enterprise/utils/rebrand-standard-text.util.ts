/* @license Enterprise */

import { type Brand } from 'twenty-shared/types';

// Standard rows are seeded once per workspace and cannot be edited, so the brand is applied when they are read.
export const rebrandStandardText = ({
  text,
  brand,
  isCustom,
}: {
  text: string;
  brand: Brand;
  isCustom: boolean;
}): string =>
  brand.isWhiteLabeled && !isCustom
    ? text.replace(/\bTwenty\b/g, () => brand.name)
    : text;

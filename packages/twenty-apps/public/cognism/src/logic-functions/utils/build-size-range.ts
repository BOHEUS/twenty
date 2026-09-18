import { toNumber } from 'src/logic-functions/utils/to-number';
import { isDefined } from 'src/logic-functions/data/is-defined';

const SIZE_RANGE_BUCKETS = [
  { upperBound: 10, value: 'SIZE_1_10' },
  { upperBound: 50, value: 'SIZE_11_50' },
  { upperBound: 200, value: 'SIZE_51_200' },
  { upperBound: 500, value: 'SIZE_201_500' },
  { upperBound: 1000, value: 'SIZE_501_1000' },
  { upperBound: 5000, value: 'SIZE_1001_5000' },
  { upperBound: 10000, value: 'SIZE_5001_10000' },
] as const;

const LARGEST_BUCKET_VALUE = 'SIZE_10001_PLUS';

export const buildSizeRange = ({
  sizeFrom,
  sizeTo,
}: {
  sizeFrom: unknown;
  sizeTo: unknown;
}): string | undefined => {
  const lowerBound = toNumber(sizeFrom) ?? toNumber(sizeTo);

  if (!isDefined(lowerBound) || lowerBound < 0) {
    return undefined;
  }

  const bucket = SIZE_RANGE_BUCKETS.find(
    (candidate) => lowerBound <= candidate.upperBound,
  );

  return bucket?.value ?? LARGEST_BUCKET_VALUE;
};

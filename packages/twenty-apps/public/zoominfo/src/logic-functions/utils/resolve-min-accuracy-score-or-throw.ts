import { isDefined } from 'twenty-sdk/utils';

import { ZoomInfoConfigError } from 'src/logic-functions/errors/zoominfo-config-error';
import { ZoomInfoInvalidInputError } from 'src/logic-functions/errors/zoominfo-invalid-input-error';
import { toNumberLike } from 'src/logic-functions/utils/to-number-like';

const MIN_ACCURACY_SCORE = 0;
const MAX_ACCURACY_SCORE = 100;

export const resolveMinAccuracyScoreOrThrow = ({
  inputMinAccuracyScore,
  defaultMinAccuracyScore,
}: {
  inputMinAccuracyScore: number | null | undefined;
  defaultMinAccuracyScore?: string;
}): number | undefined => {
  const minAccuracyScore =
    inputMinAccuracyScore ?? toNumberLike(defaultMinAccuracyScore);

  if (!isDefined(minAccuracyScore)) {
    return undefined;
  }

  const isValidAccuracyScore =
    Number.isInteger(minAccuracyScore) &&
    minAccuracyScore >= MIN_ACCURACY_SCORE &&
    minAccuracyScore <= MAX_ACCURACY_SCORE;

  if (isValidAccuracyScore) {
    return minAccuracyScore;
  }

  if (isDefined(inputMinAccuracyScore)) {
    throw new ZoomInfoInvalidInputError(
      `Minimum accuracy score must be an integer between ${MIN_ACCURACY_SCORE} and ${MAX_ACCURACY_SCORE}.`,
    );
  }

  throw new ZoomInfoConfigError(
    `Default minimum accuracy score must be an integer between ${MIN_ACCURACY_SCORE} and ${MAX_ACCURACY_SCORE}.`,
  );
};

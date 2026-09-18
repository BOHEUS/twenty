import { isNumber } from '@sniptt/guards';

import { CognismInvalidInputError } from 'src/logic-functions/errors/cognism-invalid-input-error';
import { isDefined } from 'src/logic-functions/data/is-defined';

const MIN_MATCH_SCORE = 0;
const MAX_MATCH_SCORE = 100;

export const resolveMinMatchScore = (
  inputMinMatchScore?: number,
): number | undefined => {
  if (!isDefined(inputMinMatchScore)) {
    return undefined;
  }

  const isWithinRange =
    isNumber(inputMinMatchScore) &&
    Number.isInteger(inputMinMatchScore) &&
    inputMinMatchScore >= MIN_MATCH_SCORE &&
    inputMinMatchScore <= MAX_MATCH_SCORE;

  if (!isWithinRange) {
    throw new CognismInvalidInputError(
      `Minimum match score must be an integer between ${MIN_MATCH_SCORE} and ${MAX_MATCH_SCORE}.`,
    );
  }

  return inputMinMatchScore;
};

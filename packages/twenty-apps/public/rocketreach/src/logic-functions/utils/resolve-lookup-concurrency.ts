import {
  DEFAULT_LOOKUP_CONCURRENCY,
  MAX_LOOKUP_CONCURRENCY,
} from 'src/constants/lookup-concurrency';
import { LOOKUP_CONCURRENCY_VARIABLE_NAME } from 'src/constants/server-variable-names';
import { RocketReachConfigError } from 'src/logic-functions/errors/rocketreach-config-error';
import { toText } from 'src/logic-functions/utils/to-text';
import { isDefined } from 'src/logic-functions/utils/is-defined';

export const resolveLookupConcurrency = (): number => {
  const configuredConcurrency = toText(
    process.env[LOOKUP_CONCURRENCY_VARIABLE_NAME],
  );

  if (!isDefined(configuredConcurrency)) {
    return DEFAULT_LOOKUP_CONCURRENCY;
  }

  const concurrency = Number(configuredConcurrency);
  const isValidConcurrency =
    Number.isInteger(concurrency) &&
    concurrency >= 1 &&
    concurrency <= MAX_LOOKUP_CONCURRENCY;

  if (!isValidConcurrency) {
    throw new RocketReachConfigError(
      `${LOOKUP_CONCURRENCY_VARIABLE_NAME} must be an integer between 1 and ${MAX_LOOKUP_CONCURRENCY}.`,
    );
  }

  return concurrency;
};

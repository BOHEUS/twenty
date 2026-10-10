import { AMPLEMARKET_TIME_LIMIT_MESSAGE } from 'src/constants/amplemarket-time-limit-message';
import { isAmplemarketAccountErrorOutcome } from 'src/logic-functions/utils/is-amplemarket-account-error-outcome';
import { type AmplemarketEnrichResult } from 'src/types/amplemarket-enrich-result';
import { isDefined } from 'src/utils/is-defined';

export const runAmplemarketLookups = async <TParams, TData>({
  params,
  deadline,
  lookup,
}: {
  params: TParams[];
  deadline: number;
  lookup: (entry: TParams) => Promise<AmplemarketEnrichResult<TData>>;
}): Promise<AmplemarketEnrichResult<TData>[]> => {
  const results: AmplemarketEnrichResult<TData>[] = [];

  for (const entry of params) {
    const previousResult = results[results.length - 1];

    // An invalid API key or an exhausted Amplemarket balance fails every
    // following lookup the same way
    if (
      isDefined(previousResult) &&
      isAmplemarketAccountErrorOutcome(previousResult)
    ) {
      results.push(previousResult);
      continue;
    }

    results.push(
      Date.now() > deadline
        ? {
            outcome: 'error',
            httpStatus: 0,
            message: AMPLEMARKET_TIME_LIMIT_MESSAGE,
          }
        : await lookup(entry),
    );
  }

  return results;
};

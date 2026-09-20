import { DEFAULT_CREDIT_COST_DOLLARS } from 'src/constants/default-credit-cost-dollars';
import { CREDIT_COST_DOLLARS_VARIABLE_NAME } from 'src/constants/server-variable-names';
import { RocketReachConfigError } from 'src/logic-functions/errors/rocketreach-config-error';
import { toText } from 'src/logic-functions/utils/to-text';
import { isDefined } from 'src/logic-functions/utils/is-defined';

export const resolveCreditCostDollars = (): number => {
  const configuredCost = toText(
    process.env[CREDIT_COST_DOLLARS_VARIABLE_NAME],
  );

  if (!isDefined(configuredCost)) {
    return DEFAULT_CREDIT_COST_DOLLARS;
  }

  const costDollars = Number(configuredCost);

  if (!Number.isFinite(costDollars) || costDollars < 0) {
    throw new RocketReachConfigError(
      `${CREDIT_COST_DOLLARS_VARIABLE_NAME} must be a positive number of dollars per RocketReach credit.`,
    );
  }

  return costDollars;
};

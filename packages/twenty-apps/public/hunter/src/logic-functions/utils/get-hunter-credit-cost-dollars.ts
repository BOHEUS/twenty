import { HUNTER_CREDIT_COST_DOLLARS_VARIABLE_NAME } from 'src/constants/server-variable-names';
import { HunterConfigError } from 'src/logic-functions/errors/hunter-config-error';

export const getHunterCreditCostDollars = (): number => {
  const creditCostDollars = Number.parseFloat(
    process.env[HUNTER_CREDIT_COST_DOLLARS_VARIABLE_NAME] ?? '',
  );

  if (!Number.isFinite(creditCostDollars) || creditCostDollars < 0) {
    throw new HunterConfigError(
      `${HUNTER_CREDIT_COST_DOLLARS_VARIABLE_NAME} is not set. The server admin must configure the dollar cost of one Hunter credit.`,
    );
  }

  return creditCostDollars;
};

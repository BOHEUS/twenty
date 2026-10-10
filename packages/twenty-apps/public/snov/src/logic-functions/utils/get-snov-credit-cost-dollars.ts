import { SNOV_CREDIT_COST_DOLLARS_VARIABLE_NAME } from 'src/constants/server-variable-names';
import { SnovConfigError } from 'src/logic-functions/errors/snov-config-error';

export const getSnovCreditCostDollars = (): number => {
  const creditCostDollars = Number.parseFloat(
    process.env[SNOV_CREDIT_COST_DOLLARS_VARIABLE_NAME] ?? '',
  );

  if (!Number.isFinite(creditCostDollars) || creditCostDollars < 0) {
    throw new SnovConfigError(
      `${SNOV_CREDIT_COST_DOLLARS_VARIABLE_NAME} is not set. The server admin must configure the dollar cost of one Snov.io credit.`,
    );
  }

  return creditCostDollars;
};

import { EXPLORIUM_CREDIT_COST_DOLLARS_VARIABLE_NAME } from 'src/constants/server-variable-names';
import { ExploriumConfigError } from 'src/logic-functions/errors/explorium-config-error';

export const getExploriumCreditCostDollars = (): number => {
  const creditCostDollars = Number.parseFloat(
    process.env[EXPLORIUM_CREDIT_COST_DOLLARS_VARIABLE_NAME] ?? '',
  );

  if (!Number.isFinite(creditCostDollars) || creditCostDollars < 0) {
    throw new ExploriumConfigError(
      `${EXPLORIUM_CREDIT_COST_DOLLARS_VARIABLE_NAME} is not set. The server admin must configure the dollar cost of one Explorium credit.`,
    );
  }

  return creditCostDollars;
};

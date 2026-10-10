import {
  AMPLEMARKET_EMAIL_CREDIT_COST_DOLLARS_VARIABLE_NAME,
  AMPLEMARKET_PHONE_CREDIT_COST_DOLLARS_VARIABLE_NAME,
} from 'src/constants/server-variable-names';
import { AmplemarketConfigError } from 'src/logic-functions/errors/amplemarket-config-error';

export type AmplemarketCreditCosts = {
  emailCreditCostDollars: number;
  phoneCreditCostDollars: number;
};

const readCreditCost = (variableName: string): number => {
  const creditCostDollars = Number.parseFloat(process.env[variableName] ?? '');

  if (!Number.isFinite(creditCostDollars) || creditCostDollars < 0) {
    throw new AmplemarketConfigError(
      `${variableName} is not set. The server admin must configure the dollar cost of one Amplemarket credit.`,
    );
  }

  return creditCostDollars;
};

// Amplemarket bills email and phone lookups from separate credit balances
export const getAmplemarketCreditCosts = (): AmplemarketCreditCosts => ({
  emailCreditCostDollars: readCreditCost(
    AMPLEMARKET_EMAIL_CREDIT_COST_DOLLARS_VARIABLE_NAME,
  ),
  phoneCreditCostDollars: readCreditCost(
    AMPLEMARKET_PHONE_CREDIT_COST_DOLLARS_VARIABLE_NAME,
  ),
});

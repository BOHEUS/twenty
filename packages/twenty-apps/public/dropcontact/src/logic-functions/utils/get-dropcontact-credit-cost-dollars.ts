import { DROPCONTACT_CREDIT_COST_DOLLARS_VARIABLE_NAME } from 'src/constants/server-variable-names';
import { DropcontactConfigError } from 'src/logic-functions/errors/dropcontact-config-error';

export const getDropcontactCreditCostDollars = (): number => {
  const creditCostDollars = Number.parseFloat(
    process.env[DROPCONTACT_CREDIT_COST_DOLLARS_VARIABLE_NAME] ?? '',
  );

  if (!Number.isFinite(creditCostDollars) || creditCostDollars < 0) {
    throw new DropcontactConfigError(
      `${DROPCONTACT_CREDIT_COST_DOLLARS_VARIABLE_NAME} is not set. The server admin must configure the dollar cost of one Dropcontact credit.`,
    );
  }

  return creditCostDollars;
};

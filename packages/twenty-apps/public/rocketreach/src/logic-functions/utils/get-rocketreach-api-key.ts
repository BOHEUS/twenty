import { isNonEmptyString } from '@sniptt/guards';

import { ROCKETREACH_API_KEY_VARIABLE_NAME } from 'src/constants/server-variable-names';
import { RocketReachConfigError } from 'src/logic-functions/errors/rocketreach-config-error';

export const getRocketReachApiKey = (): string => {
  const apiKey = process.env[ROCKETREACH_API_KEY_VARIABLE_NAME]?.trim();

  if (!isNonEmptyString(apiKey)) {
    throw new RocketReachConfigError(
      `${ROCKETREACH_API_KEY_VARIABLE_NAME} is not set. The workspace admin must configure the RocketReach API key in Settings -> Apps.`,
    );
  }

  return apiKey;
};

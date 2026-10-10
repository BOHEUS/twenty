import { isNonEmptyString } from '@sniptt/guards';

import { HUNTER_API_KEY_VARIABLE_NAME } from 'src/constants/server-variable-names';
import { HunterConfigError } from 'src/logic-functions/errors/hunter-config-error';

export const getHunterApiKey = (): string => {
  const apiKey = process.env[HUNTER_API_KEY_VARIABLE_NAME]?.trim();

  if (!isNonEmptyString(apiKey)) {
    throw new HunterConfigError(
      `${HUNTER_API_KEY_VARIABLE_NAME} is not set. The server admin must configure the Hunter API key.`,
    );
  }

  return apiKey;
};

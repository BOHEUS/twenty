import { isNonEmptyString } from '@sniptt/guards';

import { AMPLEMARKET_API_KEY_VARIABLE_NAME } from 'src/constants/server-variable-names';
import { AmplemarketConfigError } from 'src/logic-functions/errors/amplemarket-config-error';

export const getAmplemarketApiKey = (): string => {
  const apiKey = process.env[AMPLEMARKET_API_KEY_VARIABLE_NAME]?.trim();

  if (!isNonEmptyString(apiKey)) {
    throw new AmplemarketConfigError(
      `${AMPLEMARKET_API_KEY_VARIABLE_NAME} is not set. The server admin must configure the Amplemarket API key.`,
    );
  }

  return apiKey;
};

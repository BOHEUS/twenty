import { isNonEmptyString } from '@sniptt/guards';

import { EXPLORIUM_API_KEY_VARIABLE_NAME } from 'src/constants/server-variable-names';
import { ExploriumConfigError } from 'src/logic-functions/errors/explorium-config-error';

export const getExploriumApiKey = (): string => {
  const apiKey = process.env[EXPLORIUM_API_KEY_VARIABLE_NAME]?.trim();

  if (!isNonEmptyString(apiKey)) {
    throw new ExploriumConfigError(
      `${EXPLORIUM_API_KEY_VARIABLE_NAME} is not set. The server admin must configure the Explorium API key.`,
    );
  }

  return apiKey;
};

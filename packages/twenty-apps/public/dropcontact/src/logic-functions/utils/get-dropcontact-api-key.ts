import { isNonEmptyString } from '@sniptt/guards';

import { DROPCONTACT_API_KEY_VARIABLE_NAME } from 'src/constants/server-variable-names';
import { DropcontactConfigError } from 'src/logic-functions/errors/dropcontact-config-error';

export const getDropcontactApiKey = (): string => {
  const apiKey = process.env[DROPCONTACT_API_KEY_VARIABLE_NAME]?.trim();

  if (!isNonEmptyString(apiKey)) {
    throw new DropcontactConfigError(
      `${DROPCONTACT_API_KEY_VARIABLE_NAME} is not set. The server admin must configure the Dropcontact API key.`,
    );
  }

  return apiKey;
};

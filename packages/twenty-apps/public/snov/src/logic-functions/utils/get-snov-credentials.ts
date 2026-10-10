import { isNonEmptyString } from '@sniptt/guards';

import {
  SNOV_CLIENT_ID_VARIABLE_NAME,
  SNOV_CLIENT_SECRET_VARIABLE_NAME,
} from 'src/constants/server-variable-names';
import { SnovConfigError } from 'src/logic-functions/errors/snov-config-error';

export const getSnovCredentials = (): {
  clientId: string;
  clientSecret: string;
} => {
  const clientId = process.env[SNOV_CLIENT_ID_VARIABLE_NAME]?.trim();
  const clientSecret = process.env[SNOV_CLIENT_SECRET_VARIABLE_NAME]?.trim();

  if (!isNonEmptyString(clientId) || !isNonEmptyString(clientSecret)) {
    throw new SnovConfigError(
      `${SNOV_CLIENT_ID_VARIABLE_NAME} and ${SNOV_CLIENT_SECRET_VARIABLE_NAME} must be set. The server admin must configure the Snov.io API credentials.`,
    );
  }

  return { clientId, clientSecret };
};

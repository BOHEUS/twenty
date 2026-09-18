import { isNonEmptyString } from '@sniptt/guards';

import { CognismConfigError } from 'src/logic-functions/errors/cognism-config-error';

export const getCognismApiKey = (): string => {
  const apiKey = process.env.COGNISM_API_KEY?.trim();

  if (!isNonEmptyString(apiKey)) {
    throw new CognismConfigError(
      'COGNISM_API_KEY is not set. The workspace admin must configure the Cognism API key in Settings -> Apps.',
    );
  }

  return apiKey;
};

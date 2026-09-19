import { isNonEmptyString } from '@sniptt/guards';

import { CrustdataConfigError } from 'src/logic-functions/errors/crustdata-config-error';

export const getCrustdataApiKey = (): string => {
  const apiKey = process.env.CRUSTDATA_API_KEY?.trim();

  if (!isNonEmptyString(apiKey)) {
    throw new CrustdataConfigError(
      'CRUSTDATA_API_KEY is not set. The workspace admin must configure the Crustdata API key in Settings -> Apps.',
    );
  }

  return apiKey;
};

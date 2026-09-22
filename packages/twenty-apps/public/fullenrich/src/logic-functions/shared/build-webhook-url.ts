import { isNonEmptyString } from '@sniptt/guards';

import { WEBHOOK_FUNCTION_PATH } from 'src/constants/universal-identifiers';

export const buildWebhookUrl = ():
  | { success: true; webhookUrl: string }
  | { success: false; error: string } => {
  const functionsUrl = process.env.TWENTY_FUNCTIONS_URL?.trim().replace(
    /\/$/,
    '',
  );

  if (!isNonEmptyString(functionsUrl)) {
    return {
      success: false,
      error:
        'TWENTY_FUNCTIONS_URL is not set, so FullEnrich has no address to send results back to.',
    };
  }

  return { success: true, webhookUrl: `${functionsUrl}/s${WEBHOOK_FUNCTION_PATH}` };
};

import { isNonEmptyString } from '@sniptt/guards';

import { ZoomInfoConfigError } from 'src/logic-functions/errors/zoominfo-config-error';

export const getZoomInfoCredentialsOrThrow = (): {
  clientId: string;
  clientSecret: string;
} => {
  const clientId = process.env.ZOOMINFO_CLIENT_ID?.trim();
  const clientSecret = process.env.ZOOMINFO_CLIENT_SECRET?.trim();

  if (!isNonEmptyString(clientId) || !isNonEmptyString(clientSecret)) {
    throw new ZoomInfoConfigError(
      'ZOOMINFO_CLIENT_ID and ZOOMINFO_CLIENT_SECRET are not set. The workspace admin must configure the ZoomInfo OAuth credentials in Settings -> Apps.',
    );
  }

  return { clientId, clientSecret };
};

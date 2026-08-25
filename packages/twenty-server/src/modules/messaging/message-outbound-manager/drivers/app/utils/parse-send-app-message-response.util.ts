import { z } from 'zod';

import { type SendAppMessageResponse } from 'src/modules/messaging/message-outbound-manager/drivers/app/types/send-app-message-payload.type';

const sendAppMessageResponseSchema = z.object({
  externalId: z.string().min(1),
  threadExternalId: z.string().min(1).optional(),
});

// The app returns whatever its logic function returns, so the provider id the
// engine is about to key a message on has to be checked rather than trusted.
export const parseSendAppMessageResponse = (
  data: unknown,
): SendAppMessageResponse | undefined => {
  const result = sendAppMessageResponseSchema.safeParse(data);

  return result.success ? result.data : undefined;
};

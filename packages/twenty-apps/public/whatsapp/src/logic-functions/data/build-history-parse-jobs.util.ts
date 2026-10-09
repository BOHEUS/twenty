import { type WhatsAppHistoryValue } from 'src/logic-functions/types/whatsapp-webhook-message.type';

type HistoryChunk = WhatsAppHistoryValue['history'][number];

export const buildHistoryParseJobs = (
  businessData: { display_phone_number: string; phone_number_id: string },
  chunks: HistoryChunk[],
) =>
  chunks.flatMap((chunk) => {
    if (!('threads' in chunk)) {
      return [];
    }

    return chunk.threads.flatMap((thread) =>
      thread.messages.map((message) => ({
        payload: {
          businessData,
          // history carries no profile data, only the customer phone number
          contacts: { wa_id: thread.id, profile: { name: '' } },
          messages: message,
        },
      })),
    );
  });

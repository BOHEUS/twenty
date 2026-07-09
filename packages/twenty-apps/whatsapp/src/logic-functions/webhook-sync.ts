import { defineLogicFunction, RoutePayload } from 'twenty-sdk/define';
import { WhatsAppWebhookMessage, WhatsappWebhookMessageChanges } from 'src/logic-functions/types/whatsapp-webhook-message.type';
import { validateWebhookPayload } from 'src/logic-functions/data/validate-webhook-payload.util';
import { findConnectedAccount } from 'src/logic-functions/data/find-connected-account-by-filter.util';
import { MetadataApiClient } from 'twenty-client-sdk/metadata';
import { CoreApiClient } from 'twenty-client-sdk/core';
import { findPersonByFilter } from 'src/logic-functions/data/find-person-by-filter.util';
import { findMessageParticipant } from 'src/logic-functions/data/find-message-participant-by-filter.util';
import { createPerson } from 'src/logic-functions/data/create-person.util';
import { updatePerson } from 'src/logic-functions/data/update-person.util';
import { WhatsappFile } from 'src/logic-functions/types/whatsapp-file.type';

const handler = async (
  params: RoutePayload<WhatsAppWebhookMessage>,
): Promise<object> => {
  if (!process.env.WEBHOOK_VALIDATION_SECRET) {
    return {
      success: false,
    };
  }

  const { body, headers } = params;
  if (body === null || body?.entry === undefined) {
    return {
      success: false,
    };
  }

  const signature = headers['x-hub-signature-256'];
  if (!signature || signature === '') {
    return {
      success: false,
    };
  }

  if (
    !validateWebhookPayload(
      signature,
      JSON.stringify(body),
      process.env.WEBHOOK_VALIDATION_SECRET,
    )
  ) {
    return {
      success: false,
    };
  }

  const coreClient = new CoreApiClient();
  const metadataClient = new MetadataApiClient();
  await parseMessage(coreClient, metadataClient, body.entry[0].changes[0]);
  return {
    success: true,
  };
};

const parseMessage = async (coreClient: CoreApiClient, metadataClient: MetadataApiClient, messages: WhatsappWebhookMessageChanges) => {
// webhook comes
// find a person with specific phone number (either primary or secondary)
// if not, create a person
// find a related message participant
// if not, create a message participant
// find a related message thread
// if not, create a new message thread (generate and store all ids in KV store)
// create a new message and link it all together
  if (messages.value.messages?.[0].type === 'unsupported') {
    return {}; // not needed at time being to do anything with it, maybe when notifications will be done at some point it'll become useful
  }
  let relatedConnectedAccount = await findConnectedAccount(metadataClient, messages.value.metadata.display_phone_number);
  if (!relatedConnectedAccount) {

  }

  const senderInfo = messages.value.contacts;
  const senderPhoneNumber = messages.value.messages?.[0].from;
  if (!senderPhoneNumber || !senderInfo?.[0].wa_id) {
    return {};
  }
  let whatsAppPerson = await findPersonByFilter(coreClient, senderPhoneNumber, senderInfo?.[0].wa_id);
  if (!whatsAppPerson.people?.totalCount || whatsAppPerson.people?.totalCount === 0) {
    await createPerson(coreClient, senderPhoneNumber, senderInfo?.[0].profile.name);
    whatsAppPerson = await findPersonByFilter(coreClient, senderPhoneNumber, senderInfo?.[0].wa_id);
  }
  if (!whatsAppPerson.people?.edges[0].node) {
    return;
  }
  const businessMessageParticipant = await findMessageParticipant(coreClient, ); // ???
  const senderMessageParticipant = await findMessageParticipant(coreClient, whatsAppPerson.people?.edges[0].node.id);

  const messageTimestamp = messages.value.messages?.[0].timestamp;
  const messageType = messages.value.messages?.[0].type;
  const message = messages.value.messages?.[0].contacts;
  switch (messageType) {
    case 'audio': {
      const file: WhatsappFile = {
        mimeType: <string>messages.value.messages?.[0].audio?.mime_type,
        sha256: <string>messages.value.messages?.[0].audio?.sha256,
        url: <string>messages.value.messages?.[0].audio?.url,
      }
      break;
    }
    case 'button': {
      const text = messages.value.messages?.[0].button?.text ?? null;
      break;
    }
    case 'contacts': {
      // TODO: when contacts send, create a new Person record or message?
      break;
    }
    case 'document': {
      const text = messages.value.messages?.[0].document?.caption ?? null;
      const file: WhatsappFile = {
        mimeType: <string>messages.value.messages?.[0].document?.mime_type,
        sha256: <string>messages.value.messages?.[0].document?.sha256,
        url: <string>messages.value.messages?.[0].document?.url,
      }
      break;
    }
    case 'image': {
      const text = messages.value.messages?.[0].image?.caption ?? null;
      const file: WhatsappFile = {
        mimeType: <string>messages.value.messages?.[0].image?.mime_type,
        sha256: <string>messages.value.messages?.[0].image?.sha256,
        url: <string>messages.value.messages?.[0].image?.url,
      }
      break;
    }
    case 'interactive': {
      // TODO: check
      const text = messages.value.messages?.[0].interactive?.type === 'list_reply' ? `${messages.value.messages?.[0].interactive?.list_reply?.title} - ${messages.value.messages?.[0].interactive?.list_reply?.description}` : <string>messages.value.messages?.[0].interactive?.button_reply?.title;
      break;
    }
    case 'location': {
      const text = `Place: ${messages.value.messages?.[0].location?.name}Address: ${messages.value.messages?.[0].location?.address}\nLat: ${messages.value.messages?.[0].location?.latitude}\nLong: ${messages.value.messages?.[0].location?.longitude}\nURL: <a href='${messages.value.messages?.[0].location?.url}'>${messages.value.messages?.[0].location?.url}</a>`;
      break;
    }
    case 'order': {
      const text = <string>messages.value.messages?.[0].order?.text; // TODO ???
      break;
    }
    case 'reaction': {
      // TODO: implement or skip?
      break;
    }
    case 'sticker': {
      const file: WhatsappFile = {
        mimeType: <string>messages.value.messages?.[0].sticker?.mime_type,
        sha256: <string>messages.value.messages?.[0].sticker?.sha256,
        url: <string>messages.value.messages?.[0].sticker?.url,
      }
      break;
    }
    case 'system': {
      await updatePerson(coreClient, whatsAppPerson.people?.edges[0].node.id, <string>messages.value.messages?.[0].system?.body);
      break;
    }
    case 'text': {
      const text = messages.value.messages?.[0].text?.body ?? null;
      break;
    }
    case 'video': {
      const text = messages.value.messages?.[0].video?.caption ?? null;
      const file: WhatsappFile = {
        mimeType: <string>messages.value.messages?.[0].video?.mime_type,
        sha256: <string>messages.value.messages?.[0].video?.sha256,
        url: <string>messages.value.messages?.[0].video?.url,
      }
      break;
    }
    default: {
      return;
    }
  }
}

export default defineLogicFunction({
  universalIdentifier: '845183d7-da92-4810-afd3-4f35c3b941e3',
  name: 'webhook-sync',
  description: 'Add a description for your logic function',
  timeoutSeconds: 5,
  handler,
  httpRouteTriggerSettings: {
    path: '/whatsapp',
    httpMethod: 'POST',
    isAuthRequired: true,
  },
});

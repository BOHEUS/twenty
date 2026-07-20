import { defineLogicFunction, RoutePayload } from 'twenty-sdk/define';
import {
  WhatsAppWebhookMessage,
  WhatsappWebhookMessageBusinessData,
  WhatsAppWebhookMessageContacts,
  WhatsAppWebhookMessageContent
} from 'src/logic-functions/types/whatsapp-webhook-message.type';
import { validateWebhookPayload } from 'src/logic-functions/data/validate-webhook-payload.util';
import { findConnectedAccount } from 'src/logic-functions/data/find-connected-account-by-filter.util';
import { MetadataApiClient } from 'twenty-client-sdk/metadata';
import { CoreApiClient } from 'twenty-client-sdk/core';
import { findPersonByFilter } from 'src/logic-functions/data/find-person-by-filter.util';
import { createPerson } from 'src/logic-functions/data/create-person.util';
import { updatePerson } from 'src/logic-functions/data/update-person.util';
import { WhatsappFile } from 'src/logic-functions/types/whatsapp-file.type';
import { updateMessage } from "src/logic-functions/data/update-message.util";
import { findMessageById } from "src/logic-functions/data/find-message-by-id.util";
import { MessageParticipantType } from "src/logic-functions/types/message-participant.type";
import { getGroupMessageParticipants } from "src/logic-functions/data/get-group-message-participants.util";

const handler = async (
  params: RoutePayload<WhatsAppWebhookMessage>,
): Promise<object> => {
  if (!process.env.WEBHOOK_VALIDATION_SECRET || !process.env.ACCESS_TOKEN) {
    return {
      success: false,
    };
  }

  const { rawBody, body, headers } = params;
  if (rawBody === undefined || body === null || body?.entry === undefined || body.object !== 'whatsapp_business_account') {
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
      rawBody,
      process.env.WEBHOOK_VALIDATION_SECRET,
    )
  ) {
    return {
      success: false,
    };
  }

  const coreClient = new CoreApiClient();
  const metadataClient = new MetadataApiClient();
  for (const entry of body.entry) {
    for (const change of entry.changes) {
      if ('messages' in change.value) {
        for (const message of change.value.messages) {
          await parseMessage(coreClient, metadataClient, change.value.metadata, change.value.contacts[0], message)
        }
      }
    }
  }
  return {
    success: true,
  };
};

const parseMessage = async (coreClient: CoreApiClient, metadataClient: MetadataApiClient, businessData: WhatsappWebhookMessageBusinessData, contacts: WhatsAppWebhookMessageContacts, messages: WhatsAppWebhookMessageContent): Promise<void> => {
  /*
   webhook comes
   find a person with specific phone number (either primary or secondary)
   if not, create a person
   find a related message participant
   if not, create a message participant
   find a related message thread
   if not, create a new message thread (generate and store all ids in KV store)
   create a new message and link it all together
   */

  /*
  Questions:
     are message participants reused? NO
     is messageChannelMessageAssociation actually used somewhere?
     how to link a message to workspace available connected account?
     change logic so messages are stored and added to store (when exactly? when webhook arrives or when adding it fails due to throttle limit?)
     fix downloading file
     check if all variables are added (should they be application or server variables?)
     add upload file (how to get API key served by app?)
     how to handle group chats?
     should group ID be used as messageExternalThreadId or separately?
     how to handle case where
  */
  if (messages.type === 'unsupported') {
    return; // not needed at time being to do anything with it, maybe when notifications will be done at some point it'll become useful
  }
  let relatedConnectedAccount = await findConnectedAccount(metadataClient, businessData.display_phone_number);
  if (!relatedConnectedAccount) {
    return;
  }
  // find a thread by whatsapp id, if group id is present, use that
  let messageThread: string = '';

  const participants: MessageParticipantType[] = [];
  participants.push({
    role: "TO",
    handle: businessData.display_phone_number,
    displayName: ''/* relatedConnectedAccount */,
    personId: null
  })
  let whatsAppPerson = await findPersonByFilter(coreClient, contacts.wa_id);
  if (!whatsAppPerson.people?.totalCount || whatsAppPerson.people?.totalCount === 0) {
    await createPerson(coreClient, contacts.wa_id, messages.from, contacts.profile.name);
    whatsAppPerson = await findPersonByFilter(coreClient, contacts.wa_id);
  }
  if (!whatsAppPerson.people?.edges[0].node) {
    return;
  }
  participants.push({
    role: "FROM",
    handle: messages.from,
    displayName: contacts.profile.name,
    personId: whatsAppPerson.people.edges[0].node.id
  })
  if (messages.group_id) {
    const groupParticipants = await getGroupMessageParticipants(messages.group_id);
    for (const groupParticipant of groupParticipants) {
      whatsAppPerson = await findPersonByFilter(coreClient, groupParticipant);
      if (!whatsAppPerson) {
        await createPerson(coreClient, groupParticipant);
      }
    }

  }
  // messageParticipants are not reused
  switch (messages.type) {
    case 'audio': {
      const file: WhatsappFile = {
        mimeType: messages.audio.mime_type,
        sha256: messages.audio.sha256,
        url: messages.audio.url,
      }
      break;
    }
    case 'button': {
      const text = messages.button.text;
      break;
    }
    case 'contacts': {
      // TODO: when contacts send, create a new Person record or message?
      break;
    }
    case 'document': {
      const text = messages.document.caption;
      const file: WhatsappFile = {
        mimeType: messages.document.mime_type,
        sha256: messages.document.sha256,
        url: messages.document.url,
      }
      break;
    }
    case 'edit': {
      await updateMessage(coreClient, messages.edit.original_message_id, messages.edit.message.image.caption);
      break;
    }
    case 'image': {
      const text = messages.image.caption;
      const file: WhatsappFile = {
        mimeType: messages.image.mime_type,
        sha256: messages.image.sha256,
        url: messages.image.url,
      }
      break;
    }
    case 'interactive': {
      // TODO: check
      const text = messages.interactive.type === 'list_reply' ? `${messages.interactive?.list_reply?.title} - ${messages.interactive?.list_reply?.description}` : <string>messages.interactive?.button_reply?.title;
      break;
    }
    case 'location': {
      const text = `Place: ${messages.location?.name}\nAddress: ${messages.location?.address}\nLat: ${messages.location?.latitude}\nLong: ${messages.location?.longitude}\nURL: <a href='${messages.location?.url}'>${messages.location?.url}</a>`;
      break;
    }
    case 'order': {
      const text = messages.order.text; // TODO ???
      break;
    }
    case 'reaction': {
      // TODO: implement or skip?
      break;
    }
    case "revoke": {
      const { message } = await findMessageById(coreClient, messages.revoke.original_message_id);
      if (!message?.text) return;
      await updateMessage(coreClient, messages.revoke.original_message_id, message.text.concat(` (deleted at ${messages.timestamp})`,));
      break;
    }
    case 'sticker': {
      const file: WhatsappFile = {
        mimeType: messages.sticker.mime_type,
        sha256: messages.sticker.sha256,
        url: messages.sticker.url,
      }
      break;
    }
    case 'system': {
      await updatePerson(coreClient, whatsAppPerson.people?.edges[0].node.id, messages.system.body, messages.system.wa_id);
      break;
    }
    case 'text': {
      const text = messages.text.body;
      break;
    }
    case 'video': {
      const text = messages.video.caption;
      const file: WhatsappFile = {
        mimeType: messages.video.mime_type,
        sha256: messages.video.sha256,
        url: messages.video.url,
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
    isAuthRequired: false,
    forwardedRequestHeaders: ['x-hub-signature-256']
  },
});

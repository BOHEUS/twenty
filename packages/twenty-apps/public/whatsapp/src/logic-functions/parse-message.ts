import { defineLogicFunction } from 'twenty-sdk/define';
import { CoreApiClient } from "twenty-client-sdk/core";
import {
  WhatsappWebhookMessageBusinessData,
  WhatsAppWebhookMessageContacts,
  WhatsAppWebhookMessageContent
} from "src/logic-functions/types/whatsapp-webhook-message.type";
import { findPersonByFilter } from "src/logic-functions/data/find-person-by-filter.util";
import { createPerson } from "src/logic-functions/data/create-person.util";
import { getGroupMessageParticipants } from "src/logic-functions/data/get-group-message-participants.util";
import { WhatsappFile } from "src/logic-functions/types/whatsapp-file.type";
import { updateMessage } from "src/logic-functions/data/update-message.util";
import { findMessageById } from "src/logic-functions/data/find-message-by-id.util";
import { updatePerson } from "src/logic-functions/data/update-person.util";
import { type IngestMessageParticipant, ingestMessages, listMessageChannels } from "twenty-sdk/logic-function";
import { findWhatsappMessageThread } from "src/logic-functions/data/find-whatsapp-message-thread.util";
import { getFileExtension } from "src/logic-functions/data/get-file-extension.util";
import { WHATSAPP_LOGIC_FUNCTION_PARSE_MESSAGE_UNIVERSAL_IDENTIFIER } from "src/constants/universal-identifiers";

const handler = async (params: {
  businessData: WhatsappWebhookMessageBusinessData,
  contacts: WhatsAppWebhookMessageContacts,
  messages: WhatsAppWebhookMessageContent
}) => {
  const { businessData, contacts, messages } = params;
  const coreClient = new CoreApiClient();
  /*
  Questions:
     fix downloading file
     add upload file (how to get API key served by app?)
     is kv better than whatsapp message thread object?
  */
  if (messages.type === 'unsupported') {
    return; // not needed at time being to do anything with it, maybe when notifications will be done at some point it'll become useful
  }
  let relatedConnectedAccount = await listMessageChannels();
  if (!relatedConnectedAccount) {
    return;
  }
  // find a thread by whatsapp id, if group id is present, use that
  let messageThread: string = messages.group_id ?? await findWhatsappMessageThread(coreClient) ?? "";

  const participants: IngestMessageParticipant[] = [];
  participants.push({
    role: "TO",
    handle: businessData.display_phone_number,
    displayName: ''/* relatedConnectedAccount */,
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
      participants.push({
        role: 'TO',
        handle: '',
        displayName: '',
        personId: ''
      })
    }
  }
  let text: string = '';
  // messageParticipants are not reused
  switch (messages.type) {
    case 'audio': {
      const file: WhatsappFile = {
        fileName: 'audio_'.concat(messages.timestamp, getFileExtension(messages.audio.mime_type)),
        mimeType: messages.audio.mime_type,
        sha256: messages.audio.sha256,
        url: messages.audio.url,
      }
      break;
    }
    case 'button': {
      text = messages.button.text;
      break;
    }
    case 'contacts': {
      // TODO: when contacts send, create a new Person record or message?
      break;
    }
    case 'document': {
      text = messages.document.caption;
      const file: WhatsappFile = {
        fileName: 'document_'.concat(messages.timestamp, getFileExtension(messages.document.mime_type)),
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
      text = messages.image.caption;
      const file: WhatsappFile = {
        fileName: 'image_'.concat(messages.timestamp, getFileExtension(messages.image.mime_type)),
        mimeType: messages.image.mime_type,
        sha256: messages.image.sha256,
        url: messages.image.url,
      }
      break;
    }
    case 'interactive': {
      // TODO: check
      text = messages.interactive.type === 'list_reply' ? `${messages.interactive?.list_reply?.title} - ${messages.interactive?.list_reply?.description}` : <string>messages.interactive?.button_reply?.title;
      break;
    }
    case 'location': {
      text = `Place: ${messages.location?.name}\nAddress: ${messages.location?.address}\nLat: ${messages.location?.latitude}\nLong: ${messages.location?.longitude}\nURL: <a href='${messages.location?.url}'>${messages.location?.url}</a>`;
      break;
    }
    case 'order': {
      text = messages.order.text; // TODO ???
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
        fileName: 'sticker_'.concat(messages.timestamp, getFileExtension(messages.sticker.mime_type)),
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
      text = messages.text.body;
      break;
    }
    case 'video': {
      text = messages.video.caption;
      const file: WhatsappFile = {
        fileName: 'video_'.concat(messages.timestamp, getFileExtension(messages.video.mime_type)),
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
  // TODO: arbitrally create message channels or wait until connection provider accepts API
  await ingestMessages({
    messageChannelId: '', // find
    messages: [{
      externalId: messages.id,
      threadExternalId: messageThread,
      text,
      participants: participants,
      receivedAt: new Date(messages.timestamp),
    }]
  })
}

export default defineLogicFunction({
  universalIdentifier: WHATSAPP_LOGIC_FUNCTION_PARSE_MESSAGE_UNIVERSAL_IDENTIFIER,
  name: 'parse-message',
  description: 'Add a description for your logic function',
  timeoutSeconds: 900,
  handler,
});

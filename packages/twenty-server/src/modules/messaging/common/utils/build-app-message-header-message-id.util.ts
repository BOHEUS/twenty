// Provider ids are only unique within a chat for some providers, while
// headerMessageId is looked up workspace-wide, so namespace it. Outbound and
// ingest must agree: a sent message that comes back through the app's webhook
// has to dedupe onto the row the send created.
export const buildAppMessageHeaderMessageId = ({
  messageChannelId,
  externalId,
}: {
  messageChannelId: string;
  externalId: string;
}): string => `${messageChannelId}:${externalId}`;

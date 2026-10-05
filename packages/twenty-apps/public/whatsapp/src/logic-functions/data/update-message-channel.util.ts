import { listMessageChannels, updateMessageChannel } from "twenty-sdk/logic-function";

export const updateTwentyMessageChannel = async () => {
  const channel = (await listMessageChannels()).find(channel => channel.handle === '');
  if (channel === undefined) {
    throw new Error()
  }
  await updateMessageChannel({id: channel.id});
}
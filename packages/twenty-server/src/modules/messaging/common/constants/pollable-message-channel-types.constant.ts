import { MessageChannelType } from 'twenty-shared/types';

// Allowlist rather than a blocklist: every other channel type is fed by a
// webhook and has no import driver to poll with, so a new one must opt in here
// deliberately instead of silently joining the sync crons.
export const POLLABLE_MESSAGE_CHANNEL_TYPES: MessageChannelType[] = [
  MessageChannelType.EMAIL,
];

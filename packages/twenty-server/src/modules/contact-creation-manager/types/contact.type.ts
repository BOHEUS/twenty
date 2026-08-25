import { type MessageHandleKind } from 'twenty-shared/types';

export type Contact = {
  handle: string;
  displayName: string;
  // Absent means EMAIL: every caller predating chat channels sends addresses.
  handleKind?: MessageHandleKind;
};

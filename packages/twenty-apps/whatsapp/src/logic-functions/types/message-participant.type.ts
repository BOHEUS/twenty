export type MessageParticipantType = {
  role: 'FROM' | 'TO';
  handle: string;
  displayName: string;
  personId: string | null;
}
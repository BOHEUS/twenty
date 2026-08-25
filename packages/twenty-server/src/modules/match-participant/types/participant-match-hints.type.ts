// Some providers expose a contact's email or phone alongside their opaque id.
// The handle stays the opaque id (it is what threads the conversation), so the
// hints ride alongside it and are only used to find the person.
export type ParticipantMatchHints = {
  email?: string;
  phone?: string;
};

// Contact enrich bills per requested tier per matched person: business emails 1 credit, personal
// emails 2, phone numbers 2. Websites are free.
export const CONTACT_ENRICH_FIELDS = [
  'contact.business_emails',
  'contact.personal_emails',
  'contact.phone_numbers',
  'contact.websites',
] as const;

import { type DropcontactContactInput } from 'src/types/dropcontact-contact-input';

export type DropcontactMatchParams = {
  recordId: string;
  pendingRequestId?: string;
  contact: DropcontactContactInput;
};

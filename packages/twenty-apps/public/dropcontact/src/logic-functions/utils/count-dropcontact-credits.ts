import { isNonEmptyString } from '@sniptt/guards';

import { toDropcontactEmails } from 'src/logic-functions/utils/to-dropcontact-emails';
import { type DropcontactPersonData } from 'src/types/dropcontact-person-data';

// Dropcontact spends one credit per contact that comes back with a qualified
// email: a found email, or one sent in for verification. Refunded otherwise.
export const countDropcontactCredits = (
  contacts: DropcontactPersonData[],
): number =>
  contacts.filter((contact) =>
    toDropcontactEmails(contact.email).some((email) =>
      isNonEmptyString(email.qualification),
    ),
  ).length;

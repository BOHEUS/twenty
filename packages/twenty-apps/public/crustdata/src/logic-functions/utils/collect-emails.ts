import { isArray } from '@sniptt/guards';

import { toText } from 'src/logic-functions/utils/to-text';
import { type CrustdataEmail } from 'src/types/crustdata-person-data';
import { isDefined } from 'src/utils/is-defined';

// Invalid addresses are dropped: writing one onto a Person costs a bounce later.
const INVALID_EMAIL_STATUS = 'invalid';

export const collectEmails = (
  emailEntries: CrustdataEmail[] | null | undefined,
): string[] => {
  if (!isArray(emailEntries)) {
    return [];
  }

  return emailEntries
    .filter(
      (entry) => toText(entry?.status)?.toLowerCase() !== INVALID_EMAIL_STATUS,
    )
    .map((entry) => toText(entry?.email))
    .filter((email): email is string => isDefined(email));
};

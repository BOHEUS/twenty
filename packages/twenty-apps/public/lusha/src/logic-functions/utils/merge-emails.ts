import { type EmailsField } from 'twenty-sdk/define';
import { isDefined } from 'twenty-sdk/utils';

import { toStringArray } from 'src/logic-functions/data/to-string-array';
import { toText } from 'src/logic-functions/data/to-text';
import { type PersonRecord } from 'src/logic-functions/types/person-record.type';

// Emails Lusha returns are only ever added: the best one becomes primary when
// the person has none.
export const mergeEmails = ({
  currentEmails,
  lushaEmails,
}: {
  currentEmails: PersonRecord['emails'];
  lushaEmails: string[];
}): EmailsField | undefined => {
  const [bestLushaEmail] = lushaEmails;

  if (!isDefined(bestLushaEmail)) {
    return undefined;
  }

  const currentPrimaryEmail = toText(currentEmails?.primaryEmail);
  const currentAdditionalEmails =
    toStringArray(currentEmails?.additionalEmails) ?? [];
  const primaryEmail = currentPrimaryEmail ?? bestLushaEmail;

  const additionalEmails = (
    toStringArray([...currentAdditionalEmails, ...lushaEmails]) ?? []
  ).filter((email) => email.toLowerCase() !== primaryEmail.toLowerCase());

  if (
    isDefined(currentPrimaryEmail) &&
    additionalEmails.length === currentAdditionalEmails.length
  ) {
    return undefined;
  }

  return {
    primaryEmail,
    additionalEmails: additionalEmails.length > 0 ? additionalEmails : null,
  };
};

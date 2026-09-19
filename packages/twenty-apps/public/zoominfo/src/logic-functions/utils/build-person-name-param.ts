import { isNonEmptyString } from '@sniptt/guards';
import { isDefined } from 'twenty-sdk/utils';

import { toText } from 'src/logic-functions/utils/to-text';

export const buildPersonNameParam = ({
  firstName,
  lastName,
}: {
  firstName: unknown;
  lastName: unknown;
}): string | undefined => {
  const nameParts = [toText(firstName), toText(lastName)].filter(isDefined);
  const fullName = nameParts.join(' ');

  return isNonEmptyString(fullName) ? fullName : undefined;
};

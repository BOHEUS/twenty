import { isNonEmptyArray } from '@sniptt/guards';

import { toText } from 'src/logic-functions/utils/to-text';
import { isDefined } from 'src/logic-functions/utils/is-defined';

export const buildPersonNameParam = ({
  firstName,
  lastName,
}: {
  firstName: unknown;
  lastName: unknown;
}): string | undefined => {
  const nameTokens = [toText(firstName), toText(lastName)].filter(isDefined);

  return isNonEmptyArray(nameTokens) ? nameTokens.join(' ') : undefined;
};

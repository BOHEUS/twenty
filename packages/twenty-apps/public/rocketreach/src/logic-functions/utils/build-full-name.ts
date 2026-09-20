import { capitalizeName } from 'src/logic-functions/utils/capitalize-name';
import { toText } from 'src/logic-functions/utils/to-text';
import { type FullNameValue } from 'src/types/full-name-value';
import { isDefined } from 'src/logic-functions/utils/is-defined';

const WHITESPACE_REGEX = /\s+/;

// RocketReach returns one `name` string with no first/last split of its own.
export const buildFullName = (rawName: unknown): FullNameValue | undefined => {
  const fullName = toText(rawName);
  if (!isDefined(fullName)) {
    return undefined;
  }

  const [firstNameToken, ...remainingNameTokens] =
    fullName.split(WHITESPACE_REGEX);

  return {
    firstName: capitalizeName(firstNameToken),
    lastName: capitalizeName(remainingNameTokens.join(' ')),
  };
};

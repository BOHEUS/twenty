import { toText } from 'src/logic-functions/utils/to-text';
import { type PersonNode } from 'src/types/person-node';
import { isDefined } from 'src/utils/is-defined';

export const buildFullNameText = (
  name: PersonNode['name'],
): string | undefined =>
  toText(
    [toText(name?.firstName), toText(name?.lastName)]
      .filter(isDefined)
      .join(' '),
  );

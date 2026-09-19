import { isDefined } from 'twenty-sdk/utils';

import { toText } from 'src/logic-functions/utils/to-text';

export const isEmptyText = (value: unknown): boolean => !isDefined(toText(value));

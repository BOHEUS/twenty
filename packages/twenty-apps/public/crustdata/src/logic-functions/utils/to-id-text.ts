import { isNumber } from '@sniptt/guards';

import { toText } from 'src/logic-functions/utils/to-text';

// Crustdata returns its own record ids as integers, while Twenty stores them in a TEXT field.
export const toIdText = (value: unknown): string | undefined =>
  isNumber(value) && Number.isFinite(value) ? String(value) : toText(value);

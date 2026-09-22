import { isNonEmptyString } from '@sniptt/guards';

export const normalizeNotes = (
  notes: string | null | undefined,
): string | null => (isNonEmptyString(notes) ? notes : null);

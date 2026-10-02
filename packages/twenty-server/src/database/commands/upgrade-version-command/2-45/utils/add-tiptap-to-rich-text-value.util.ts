import { isNonEmptyString } from '@sniptt/guards';
import {
  isDefined,
  isPlainObject,
  normalizeRichTextDocument,
} from 'twenty-shared/utils';

// Only adds the tiptap key: blocknote and markdown stay as stored, so
// removing tiptap restores the previous value.
export const addTiptapToRichTextValue = (
  value: unknown,
): { value: unknown; hasChanged: boolean } => {
  if (!isPlainObject(value) || isNonEmptyString(value.tiptap)) {
    return { value, hasChanged: false };
  }

  const normalizedDocument = normalizeRichTextDocument({
    blocknote: isNonEmptyString(value.blocknote) ? value.blocknote : null,
    markdown: isNonEmptyString(value.markdown) ? value.markdown : null,
  });

  if (!isDefined(normalizedDocument)) {
    return { value, hasChanged: false };
  }

  return {
    value: { ...value, tiptap: JSON.stringify(normalizedDocument.document) },
    hasChanged: true,
  };
};

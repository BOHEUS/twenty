import { isPlainObject } from 'twenty-shared/utils';

export const removeTiptapFromRichTextValue = (
  value: unknown,
): { value: unknown; hasChanged: boolean } => {
  if (!isPlainObject(value) || !('tiptap' in value)) {
    return { value, hasChanged: false };
  }

  const { tiptap: _tiptap, ...valueWithoutTiptap } = value;

  return { value: valueWithoutTiptap, hasChanged: true };
};

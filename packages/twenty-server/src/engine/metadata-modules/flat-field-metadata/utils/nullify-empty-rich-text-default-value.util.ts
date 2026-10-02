import { type FieldMetadataDefaultValueForAnyType } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';

import { isNullEquivalentTextDefaultValue } from './is-null-equivalent-text-default-value.util';

export const nullifyEmptyRichTextDefaultValue = (
  defaultValue: FieldMetadataDefaultValueForAnyType,
): FieldMetadataDefaultValueForAnyType => {
  if (!isDefined(defaultValue)) {
    return null;
  }

  const v = defaultValue as {
    markdown?: string | null;
    tiptap?: string | null;
  };

  const markdown = isNullEquivalentTextDefaultValue(v.markdown)
    ? null
    : (v.markdown ?? null);
  const tiptap = isNullEquivalentTextDefaultValue(v.tiptap)
    ? null
    : (v.tiptap ?? null);

  if (markdown === null && tiptap === null) {
    return null;
  }

  return { markdown, tiptap };
};

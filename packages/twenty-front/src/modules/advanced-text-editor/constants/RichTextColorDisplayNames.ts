import { type RichTextColorName } from '@/advanced-text-editor/types/RichTextColorName';
import { msg } from '@lingui/core/macro';
import { type MessageDescriptor } from '@lingui/core';

export const RICH_TEXT_COLOR_DISPLAY_NAMES: Record<
  RichTextColorName,
  MessageDescriptor
> = {
  gray: msg`Gray`,
  brown: msg`Brown`,
  red: msg`Red`,
  orange: msg`Orange`,
  yellow: msg`Yellow`,
  green: msg`Green`,
  blue: msg`Blue`,
  purple: msg`Purple`,
  pink: msg`Pink`,
};

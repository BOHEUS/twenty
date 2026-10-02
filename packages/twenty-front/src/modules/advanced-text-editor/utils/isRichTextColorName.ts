import { RICH_TEXT_COLOR_NAMES } from '@/advanced-text-editor/constants/RichTextColorNames';
import { type RichTextColorName } from '@/advanced-text-editor/types/RichTextColorName';

export const isRichTextColorName = (
  value: unknown,
): value is RichTextColorName =>
  RICH_TEXT_COLOR_NAMES.some((colorName) => colorName === value);

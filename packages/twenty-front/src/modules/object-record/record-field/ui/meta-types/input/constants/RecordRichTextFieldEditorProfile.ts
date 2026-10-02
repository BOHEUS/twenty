import { type AdvancedTextEditorProfile } from '@/advanced-text-editor/types/AdvancedTextEditorProfile';
import { buildRecordRichTextExtensions } from '@/advanced-text-editor/utils/buildRecordRichTextExtensions';

export const RECORD_RICH_TEXT_FIELD_EDITOR_PROFILE = {
  chrome: 'document',
  minHeight: 120,
  enableFullScreen: false,
  buildExtensions: buildRecordRichTextExtensions,
} satisfies AdvancedTextEditorProfile;

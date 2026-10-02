import { type AdvancedTextEditorProfile } from '@/advanced-text-editor/types/AdvancedTextEditorProfile';
import { buildRecordRichTextExtensions } from '@/advanced-text-editor/utils/buildRecordRichTextExtensions';

export const RECORD_RICH_TEXT_FORM_FIELD_EDITOR_PROFILE = {
  chrome: 'field',
  minHeight: 340,
  enableFullScreen: true,
  buildExtensions: buildRecordRichTextExtensions,
} satisfies AdvancedTextEditorProfile;

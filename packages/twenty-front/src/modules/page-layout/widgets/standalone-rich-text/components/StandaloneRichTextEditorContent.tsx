import { type Editor } from '@tiptap/core';
import { t } from '@lingui/core/macro';
import { useStore } from 'jotai';
import { useCallback, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { AdvancedTextEditor } from '@/advanced-text-editor/components/AdvancedTextEditor';
import { useAdvancedTextEditor } from '@/advanced-text-editor/hooks/useAdvancedTextEditor';
import { serializeAdvancedTextEditorDocument } from '@/advanced-text-editor/utils/serializeAdvancedTextEditorDocument';
import { RICH_TEXT_EDITOR_GLOBAL_HOTKEYS_CONFIG } from '@/advanced-text-editor/constants/RichTextEditorGlobalHotkeysConfig';
import { isLayoutCustomizationModeEnabledState } from '@/layout-customization/states/isLayoutCustomizationModeEnabledState';
import { useMentionSearch } from '@/mention/hooks/useMentionSearch';
import { RECORD_RICH_TEXT_FIELD_EDITOR_PROFILE } from '@/object-record/record-field/ui/meta-types/input/constants/RecordRichTextFieldEditorProfile';
import { buildRichTextFieldValueFromTiptap } from '@/object-record/record-field/ui/utils/buildRichTextFieldValueFromTiptap';
import { getRichTextFieldTiptapDocument } from '@/object-record/record-field/ui/utils/getRichTextFieldTiptapDocument';
import { useUpdatePageLayoutWidget } from '@/page-layout/hooks/useUpdatePageLayoutWidget';
import { isDashboardInEditModeComponentState } from '@/page-layout/states/isDashboardInEditModeComponentState';
import { type PageLayoutWidget } from '@/page-layout/types/PageLayoutWidget';
import { StandaloneRichTextWidgetAutoFocusEffect } from '@/page-layout/widgets/standalone-rich-text/components/StandaloneRichTextWidgetAutoFocusEffect';
import { usePushFocusItemToFocusStack } from '@/ui/utilities/focus/hooks/usePushFocusItemToFocusStack';
import { useRemoveFocusItemFromFocusStackById } from '@/ui/utilities/focus/hooks/useRemoveFocusItemFromFocusStackById';
import { FocusComponentType } from '@/ui/utilities/focus/types/FocusComponentType';
import { useAtomComponentStateCallbackState } from '@/ui/utilities/state/jotai/hooks/useAtomComponentStateCallbackState';
import {
  type RichTextBody,
  WidgetConfigurationType,
} from '~/generated-metadata/graphql';

type StandaloneRichTextEditorContentProps = {
  widget: PageLayoutWidget;
  body: RichTextBody | null | undefined;
  isEditable: boolean;
  shouldFocus: boolean;
  containerElement: HTMLDivElement | null;
};

export const StandaloneRichTextEditorContent = ({
  widget,
  body,
  isEditable,
  shouldFocus,
  containerElement,
}: StandaloneRichTextEditorContentProps) => {
  const { updatePageLayoutWidget } = useUpdatePageLayoutWidget();
  const { pushFocusItemToFocusStack } = usePushFocusItemToFocusStack();
  const { removeFocusItemFromFocusStackById } =
    useRemoveFocusItemFromFocusStackById();
  const { searchMentionRecords } = useMentionSearch();
  const isDashboardInEditModeState = useAtomComponentStateCallbackState(
    isDashboardInEditModeComponentState,
  );
  const store = useStore();

  const [initialDocument] = useState(() =>
    getRichTextFieldTiptapDocument(body),
  );

  const shouldPersistDraft = () =>
    isEditable &&
    (store.get(isDashboardInEditModeState) ||
      store.get(isLayoutCustomizationModeEnabledState.atom));

  const handlePersistBody = useDebouncedCallback((tiptap: string) => {
    if (!shouldPersistDraft()) {
      return;
    }

    updatePageLayoutWidget(widget.id, {
      configuration: {
        configurationType: WidgetConfigurationType.STANDALONE_RICH_TEXT,
        body: buildRichTextFieldValueFromTiptap(tiptap),
      },
    });
  }, 300);

  const handleFocus = () => {
    pushFocusItemToFocusStack({
      component: {
        instanceId: widget.id,
        type: FocusComponentType.STANDALONE_RICH_TEXT_WIDGET,
      },
      focusId: widget.id,
      globalHotkeysConfig: RICH_TEXT_EDITOR_GLOBAL_HOTKEYS_CONFIG,
    });
  };

  const handleBlur = () => {
    handlePersistBody.flush();
    removeFocusItemFromFocusStackById({ focusId: widget.id });
  };

  const editor = useAdvancedTextEditor(
    {
      profile: RECORD_RICH_TEXT_FIELD_EDITOR_PROFILE,
      placeholder: t`Enter text or type '/' for commands`,
      readonly: !isEditable,
      defaultValue: null,
      content: initialDocument,
      onUpdate: (updatedEditor: Editor) =>
        handlePersistBody(serializeAdvancedTextEditorDocument(updatedEditor)),
      onFocus: handleFocus,
      onBlur: handleBlur,
      searchMentionRecords,
    },
    [isEditable],
  );

  const handleFocusRequest = useCallback(() => {
    editor?.commands.focus('end');
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <>
      <StandaloneRichTextWidgetAutoFocusEffect
        shouldFocus={shouldFocus}
        focusEditor={handleFocusRequest}
        containerElement={containerElement}
      />
      <AdvancedTextEditor
        editor={editor}
        readonly={!isEditable}
        minHeight={0}
      />
    </>
  );
};

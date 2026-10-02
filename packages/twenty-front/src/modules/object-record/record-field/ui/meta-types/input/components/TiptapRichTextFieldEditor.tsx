import { type Editor } from '@tiptap/core';
import { useAtom, useStore } from 'jotai';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useUploadAttachmentFile } from '@/activities/files/hooks/useUploadAttachmentFile';
import { type Attachment } from '@/activities/files/types/Attachment';
import { getActivityTargetObjectFieldIdName } from '@/activities/utils/getActivityTargetObjectFieldIdName';
import { AdvancedTextEditor } from '@/advanced-text-editor/components/AdvancedTextEditor';
import { useAdvancedTextEditor } from '@/advanced-text-editor/hooks/useAdvancedTextEditor';
import { serializeAdvancedTextEditorDocument } from '@/advanced-text-editor/utils/serializeAdvancedTextEditorDocument';
import { BLOCK_EDITOR_GLOBAL_HOTKEYS_CONFIG } from '@/blocknote-editor/constants/BlockEditorGlobalHotkeysConfig';
import { useAttachmentSync } from '@/blocknote-editor/hooks/useAttachmentSync';
import { useMentionSearch } from '@/mention/hooks/useMentionSearch';
import { useApolloCoreClient } from '@/object-metadata/hooks/useApolloCoreClient';
import { useObjectMetadataItem } from '@/object-metadata/hooks/useObjectMetadataItem';
import { modifyRecordFromCache } from '@/object-record/cache/utils/modifyRecordFromCache';
import { useFindManyRecords } from '@/object-record/hooks/useFindManyRecords';
import { useUpdateOneRecord } from '@/object-record/hooks/useUpdateOneRecord';
import { useIsRecordFieldReadOnly } from '@/object-record/read-only/hooks/useIsRecordFieldReadOnly';
import { RECORD_RICH_TEXT_FIELD_EDITOR_PROFILE } from '@/object-record/record-field/ui/meta-types/input/constants/RecordRichTextFieldEditorProfile';
import { buildRichTextFieldValueFromTiptap } from '@/object-record/record-field/ui/utils/buildRichTextFieldValueFromTiptap';
import { getRichTextFieldTiptapDocument } from '@/object-record/record-field/ui/utils/getRichTextFieldTiptapDocument';
import { type FieldRichTextValue } from '@/object-record/record-field/ui/types/FieldMetadata';
import { useRecordSeededDraft } from '@/object-record/record-seeded-draft/hooks/useRecordSeededDraft';
import { recordStoreFamilyState } from '@/object-record/record-store/states/recordStoreFamilyState';
import { usePushFocusItemToFocusStack } from '@/ui/utilities/focus/hooks/usePushFocusItemToFocusStack';
import { useRemoveFocusItemFromFocusStackById } from '@/ui/utilities/focus/hooks/useRemoveFocusItemFromFocusStackById';
import { FocusComponentType } from '@/ui/utilities/focus/types/FocusComponentType';
import { useHotkeysOnFocusedElement } from '@/ui/utilities/hotkey/hooks/useHotkeysOnFocusedElement';
import { t } from '@lingui/core/macro';
import { Key } from 'ts-key-enum';
import { CoreObjectNameSingular } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';
import { useDebouncedCallback } from 'use-debounce';

type TiptapRichTextFieldEditorProps = {
  recordId: string;
  objectNameSingular: string;
  fieldName: string;
  onPersistBody?: (body: FieldRichTextValue) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  editorRef?: React.MutableRefObject<Editor | null>;
};

export const TiptapRichTextFieldEditor = ({
  recordId,
  objectNameSingular,
  fieldName,
  onPersistBody,
  onFocus: onFocusOverride,
  onBlur: onBlurOverride,
  editorRef,
}: TiptapRichTextFieldEditorProps) => {
  const store = useStore();
  const [recordInStore] = useAtom(recordStoreFamilyState.atomFamily(recordId));

  const cache = useApolloCoreClient().cache;

  const { objectMetadataItem } = useObjectMetadataItem({
    objectNameSingular,
  });

  const fieldMetadataItem = objectMetadataItem.fields.find(
    (field) => field.name === fieldName,
  );

  const { updateOneRecord } = useUpdateOneRecord();

  const isRecordFieldReadOnly = useIsRecordFieldReadOnly({
    recordId,
    objectMetadataId: objectMetadataItem.id,
    fieldMetadataId: fieldMetadataItem?.id ?? '',
  });

  const { pushFocusItemToFocusStack } = usePushFocusItemToFocusStack();
  const { removeFocusItemFromFocusStackById } =
    useRemoveFocusItemFromFocusStackById();

  const focusId = `${recordId}-${fieldName}`;

  const { records: attachments } = useFindManyRecords<Attachment>({
    objectNameSingular: CoreObjectNameSingular.Attachment,
    filter: {
      [getActivityTargetObjectFieldIdName({
        nameSingular: objectNameSingular,
      })]: {
        eq: recordId,
      },
    },
  });

  const { syncAttachments } = useAttachmentSync(attachments);
  const { uploadAttachmentFile } = useUploadAttachmentFile();
  const { searchMentionRecords } = useMentionSearch();

  const handleImageUpload = async (file: File) => {
    const { attachmentAbsoluteURL, attachmentFileId } =
      await uploadAttachmentFile(file, {
        id: recordId,
        targetObjectNameSingular: objectNameSingular,
      });

    return { url: attachmentAbsoluteURL, fileId: attachmentFileId };
  };

  const fieldValue = isDefined(recordInStore)
    ? (recordInStore as Record<string, Partial<FieldRichTextValue> | null>)[
        fieldName
      ]
    : null;

  // Converting legacy values is costly on large notes, so only redo it when
  // the stored value changes.
  const upstreamDocument = useMemo(
    () => getRichTextFieldTiptapDocument(fieldValue),
    [fieldValue],
  );

  const { updateDraft, markDirty, flush, draftResyncKey } =
    useRecordSeededDraft({
      upstreamDraft: {
        tiptap: isDefined(upstreamDocument)
          ? JSON.stringify(upstreamDocument)
          : '',
      },
      persistDebounceMs: 300,
      resetKey: recordId,
      onPersist: ({ tiptap }) => {
        if (isRecordFieldReadOnly === true) return;

        const body = buildRichTextFieldValueFromTiptap(tiptap);

        if (onPersistBody) {
          onPersistBody(body);
          return;
        }

        updateOneRecord({
          idToUpdate: recordId,
          objectNameSingular,
          updateOneRecordInput: { [fieldName]: body },
        });
      },
    });

  const handleBodyChange = async (tiptap: string) => {
    const oldRecord = store.get(recordStoreFamilyState.atomFamily(recordId));
    const body = buildRichTextFieldValueFromTiptap(tiptap);

    store.set(
      recordStoreFamilyState.atomFamily(recordId),
      (prev: typeof oldRecord) => ({
        ...prev,
        id: recordId,
        [fieldName]: body,
        __typename: prev?.__typename ?? objectNameSingular,
      }),
    );

    modifyRecordFromCache({
      recordId,
      fieldModifiers: {
        [fieldName]: () => body,
      },
      cache,
      objectMetadataItem,
    });

    const oldFieldValue = oldRecord?.[fieldName] as
      | Partial<FieldRichTextValue>
      | undefined;

    updateDraft({ tiptap });

    // Attachment sync diffs BlockNote image and file blocks, so compare the
    // derived BlockNote of both versions.
    if (isDefined(body.blocknote)) {
      const oldDocument = getRichTextFieldTiptapDocument(oldFieldValue);

      await syncAttachments(
        body.blocknote,
        isDefined(oldDocument)
          ? buildRichTextFieldValueFromTiptap(JSON.stringify(oldDocument))
              .blocknote
          : undefined,
      );
    }
  };

  const handleBodyChangeDebounced = useDebouncedCallback(handleBodyChange, 500);

  const handleEditorUpdate = (editor: Editor) => {
    // Serialization is debounced, so mark dirty now or a remote adoption
    // could replace in-progress typing.
    markDirty();

    handleBodyChangeDebounced(serializeAdvancedTextEditorDocument(editor));
  };

  const handleFocus = useCallback(() => {
    if (onFocusOverride) {
      onFocusOverride();
      return;
    }

    pushFocusItemToFocusStack({
      component: {
        instanceId: focusId,
        type: FocusComponentType.ACTIVITY_RICH_TEXT_EDITOR,
      },
      focusId,
      globalHotkeysConfig: BLOCK_EDITOR_GLOBAL_HOTKEYS_CONFIG,
    });
  }, [focusId, pushFocusItemToFocusStack, onFocusOverride]);

  const handleBlur = () => {
    handleBodyChangeDebounced.flush();
    flush();

    if (onBlurOverride) {
      onBlurOverride();
      return;
    }

    removeFocusItemFromFocusStackById({ focusId });
  };

  const editor = useAdvancedTextEditor(
    {
      profile: RECORD_RICH_TEXT_FIELD_EDITOR_PROFILE,
      placeholder: t`Type '/' for commands, '@' for mentions`,
      readonly: isRecordFieldReadOnly,
      defaultValue: null,
      content: upstreamDocument,
      onUpdate: handleEditorUpdate,
      onFocus: handleFocus,
      onBlur: handleBlur,
      onImageUpload: handleImageUpload,
      searchMentionRecords,
    },
    [recordId, isRecordFieldReadOnly],
  );

  if (isDefined(editorRef)) {
    editorRef.current = editor;
  }

  const [lastAppliedResyncKey, setLastAppliedResyncKey] =
    useState(draftResyncKey);

  // Replace the editor content in place when another client changed the body.
  useEffect(() => {
    if (draftResyncKey === lastAppliedResyncKey || !isDefined(editor)) {
      return;
    }

    setLastAppliedResyncKey(draftResyncKey);
    editor.commands.setContent(upstreamDocument ?? '', { emitUpdate: false });
  }, [draftResyncKey, lastAppliedResyncKey, editor, upstreamDocument]);

  useHotkeysOnFocusedElement({
    keys: Key.Escape,
    callback: () => {
      editor?.commands.blur();
    },
    focusId,
    dependencies: [editor],
  });

  if (!isDefined(editor)) {
    return null;
  }

  return (
    <AdvancedTextEditor
      editor={editor}
      readonly={isRecordFieldReadOnly}
      minHeight={RECORD_RICH_TEXT_FIELD_EDITOR_PROFILE.minHeight}
    />
  );
};

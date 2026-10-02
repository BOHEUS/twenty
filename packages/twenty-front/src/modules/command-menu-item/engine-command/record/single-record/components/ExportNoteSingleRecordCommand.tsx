import { HeadlessEngineCommandWrapperEffect } from '@/command-menu-item/engine-command/components/HeadlessEngineCommandWrapperEffect';
import { useHeadlessCommandContextApi } from '@/command-menu-item/engine-command/hooks/useHeadlessCommandContextApi';
import { getRichTextFieldTiptapDocument } from '@/object-record/record-field/ui/utils/getRichTextFieldTiptapDocument';
import { isDefined, TIPTAP_NODE_TYPES } from 'twenty-shared/utils';

export const ExportNoteSingleRecordCommand = () => {
  const { selectedRecords } = useHeadlessCommandContextApi();
  const selectedRecord = selectedRecords[0];

  const recordId = selectedRecord?.id;

  if (!isDefined(recordId) || !isDefined(selectedRecord)) {
    throw new Error(
      'Record ID and selected record are required to export note to PDF',
    );
  }

  const filename = `${(selectedRecord.title || 'Untitled Note').replace(/[<>:"/\\|?*]/g, '-')}`;

  const handleExecute = async () => {
    const document = getRichTextFieldTiptapDocument(selectedRecord.bodyV2) ?? {
      type: TIPTAP_NODE_TYPES.DOCUMENT,
    };

    const { exportTipTapDocumentToPdf } =
      await import('@/command-menu-item/record/single-record/utils/exportTipTapDocumentToPdf');

    await exportTipTapDocumentToPdf(document, filename);
  };

  return <HeadlessEngineCommandWrapperEffect execute={handleExecute} />;
};

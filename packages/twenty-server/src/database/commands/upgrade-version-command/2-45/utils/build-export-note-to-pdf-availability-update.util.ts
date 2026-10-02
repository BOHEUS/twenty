import { isDefined } from 'twenty-shared/utils';

import { type FlatCommandMenuItem } from 'src/engine/metadata-modules/flat-command-menu-item/types/flat-command-menu-item.type';

const EXPORT_NOTE_TO_PDF_UNIVERSAL_IDENTIFIER =
  '86c8f3aa-9276-4c16-8cff-e295e34fbaf0';

const PREVIOUS_EXPORT_NOTE_TO_PDF_EXPRESSION =
  'pageType == "RECORD_PAGE" and (objectMetadataItem.nameSingular == "note" or objectMetadataItem.nameSingular == "task") and someNonEmptyString(selectedRecords, "bodyV2.blocknote")';

const NEXT_EXPORT_NOTE_TO_PDF_EXPRESSION =
  'pageType == "RECORD_PAGE" and (objectMetadataItem.nameSingular == "note" or objectMetadataItem.nameSingular == "task") and someNonEmptyString(selectedRecords, "bodyV2.markdown")';

export const buildExportNoteToPdfAvailabilityUpdate = ({
  flatCommandMenuItemsByUniversalIdentifier,
  now,
  direction,
}: {
  flatCommandMenuItemsByUniversalIdentifier: Record<
    string,
    FlatCommandMenuItem | undefined
  >;
  now: string;
  direction: 'up' | 'down';
}): FlatCommandMenuItem[] => {
  const exportNoteToPdf =
    flatCommandMenuItemsByUniversalIdentifier[
      EXPORT_NOTE_TO_PDF_UNIVERSAL_IDENTIFIER
    ];

  const [fromExpression, toExpression] =
    direction === 'up'
      ? [
          PREVIOUS_EXPORT_NOTE_TO_PDF_EXPRESSION,
          NEXT_EXPORT_NOTE_TO_PDF_EXPRESSION,
        ]
      : [
          NEXT_EXPORT_NOTE_TO_PDF_EXPRESSION,
          PREVIOUS_EXPORT_NOTE_TO_PDF_EXPRESSION,
        ];

  if (
    !isDefined(exportNoteToPdf) ||
    exportNoteToPdf.conditionalAvailabilityExpression !== fromExpression
  ) {
    return [];
  }

  return [
    {
      ...exportNoteToPdf,
      conditionalAvailabilityExpression: toExpression,
      updatedAt: now,
    },
  ];
};

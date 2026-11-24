import { type EnrichedObjectMetadataItem } from '@/object-metadata/types/EnrichedObjectMetadataItem';
import { RECORD_TABLE_WIDGET_DEFAULT_VIEW_FIELD_SIZE } from '@/page-layout/widgets/record-table/constants/RecordTableWidgetDefaultViewFieldSize';
import { type RecordTableWidgetViewFieldItem } from '@/page-layout/widgets/record-table/types/RecordTableWidgetViewFieldItem';
import { filterFieldsForRecordTableViewCreation } from '@/page-layout/widgets/record-table/utils/filterFieldsForRecordTableViewCreation';
import { sortFieldsByRelevanceForRecordTableWidget } from '@/page-layout/widgets/record-table/utils/sortFieldsByRelevanceForRecordTableWidget';
import { type ViewField } from '@/views/types/ViewField';

type BuildMissingRecordTableWidgetViewFieldsArgs = {
  viewId: string;
  viewFields: ViewField[];
  objectMetadataItem: EnrichedObjectMetadataItem;
};

// The field metadata id doubles as the client id so the item keeps its identity once added to the draft
export const buildMissingRecordTableWidgetViewFields = ({
  viewId,
  viewFields,
  objectMetadataItem,
}: BuildMissingRecordTableWidgetViewFieldsArgs): RecordTableWidgetViewFieldItem[] => {
  const fieldMetadataIdsInView = new Set(
    viewFields.map((viewField) => viewField.fieldMetadataId),
  );

  const nextPosition =
    Math.max(-1, ...viewFields.map((viewField) => viewField.position)) + 1;

  return objectMetadataItem.fields
    .filter(
      (field) =>
        !fieldMetadataIdsInView.has(field.id) &&
        filterFieldsForRecordTableViewCreation(
          field,
          objectMetadataItem.labelIdentifierFieldMetadataId,
        ),
    )
    .toSorted(
      sortFieldsByRelevanceForRecordTableWidget(
        objectMetadataItem.labelIdentifierFieldMetadataId,
      ),
    )
    .map((fieldMetadataItem, index) => ({
      fieldMetadataItem,
      viewField: {
        id: fieldMetadataItem.id,
        viewId,
        fieldMetadataId: fieldMetadataItem.id,
        position: nextPosition + index,
        size: RECORD_TABLE_WIDGET_DEFAULT_VIEW_FIELD_SIZE,
        isActive: true,
        isVisible: false,
      },
    }));
};

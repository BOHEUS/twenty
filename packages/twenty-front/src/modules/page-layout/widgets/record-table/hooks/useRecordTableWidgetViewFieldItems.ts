import { objectMetadataItemsSelector } from '@/object-metadata/states/objectMetadataItemsSelector';
import { useMapViewFieldToRecordTableWidgetViewFieldItem } from '@/page-layout/widgets/record-table/hooks/useMapViewFieldToRecordTableWidgetViewFieldItem';
import { useRecordTableWidgetViewForDisplay } from '@/page-layout/widgets/record-table/hooks/useRecordTableWidgetViewForDisplay';
import { type RecordTableWidgetViewFieldItem } from '@/page-layout/widgets/record-table/types/RecordTableWidgetViewFieldItem';
import { buildMissingRecordTableWidgetViewFields } from '@/page-layout/widgets/record-table/utils/buildMissingRecordTableWidgetViewFields';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { useMemo } from 'react';
import { isDefined } from 'twenty-shared/utils';
import { sortByProperty } from '~/utils/array/sortByProperty';

type UseRecordTableWidgetViewFieldItemsParams = {
  viewId: string;
  widgetId: string;
  pageLayoutId: string;
};

export const useRecordTableWidgetViewFieldItems = ({
  viewId,
  widgetId,
  pageLayoutId,
}: UseRecordTableWidgetViewFieldItemsParams) => {
  const { view } = useRecordTableWidgetViewForDisplay({
    viewId,
    widgetId,
    pageLayoutId,
  });

  const objectMetadataItems = useAtomStateValue(objectMetadataItemsSelector);

  const { mapViewFieldToRecordTableWidgetViewFieldItem } =
    useMapViewFieldToRecordTableWidgetViewFieldItem();

  const recordTableWidgetViewFieldItems: RecordTableWidgetViewFieldItem[] =
    useMemo(() => {
      if (!isDefined(view)) {
        return [];
      }

      const viewFieldItems = view.viewFields
        .toSorted(sortByProperty('position'))
        .map(mapViewFieldToRecordTableWidgetViewFieldItem)
        .filter(isDefined);

      const objectMetadataItem = objectMetadataItems.find(
        (objectMetadataItem) => objectMetadataItem.id === view.objectMetadataId,
      );

      if (!isDefined(objectMetadataItem)) {
        return viewFieldItems;
      }

      return [
        ...viewFieldItems,
        ...buildMissingRecordTableWidgetViewFields({
          viewId: view.id,
          viewFields: view.viewFields,
          objectMetadataItem,
        }),
      ];
    }, [
      view,
      objectMetadataItems,
      mapViewFieldToRecordTableWidgetViewFieldItem,
    ]);

  return { recordTableWidgetViewFieldItems };
};

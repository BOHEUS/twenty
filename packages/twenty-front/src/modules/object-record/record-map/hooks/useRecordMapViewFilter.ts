import { flattenedFieldMetadataItemsSelector } from '@/object-metadata/states/flattenedFieldMetadataItemsSelector';
import { type EnrichedObjectMetadataItem } from '@/object-metadata/types/EnrichedObjectMetadataItem';
import { currentRecordFilterGroupsComponentState } from '@/object-record/record-filter-group/states/currentRecordFilterGroupsComponentState';
import { useFilterValueDependencies } from '@/object-record/record-filter/hooks/useFilterValueDependencies';
import { anyFieldFilterValueComponentState } from '@/object-record/record-filter/states/anyFieldFilterValueComponentState';
import { currentRecordFiltersComponentState } from '@/object-record/record-filter/states/currentRecordFiltersComponentState';
import { useAtomComponentStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentStateValue';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import {
  combineFilters,
  computeRecordGqlOperationFilter,
  turnAnyFieldFilterIntoRecordGqlFilter,
} from 'twenty-shared/utils';

type UseRecordMapViewFilterParams = {
  objectMetadataItem: EnrichedObjectMetadataItem;
  viewBarInstanceId: string;
};

export const useRecordMapViewFilter = ({
  objectMetadataItem,
  viewBarInstanceId,
}: UseRecordMapViewFilterParams) => {
  const currentRecordFilters = useAtomComponentStateValue(
    currentRecordFiltersComponentState,
    viewBarInstanceId,
  );
  const currentRecordFilterGroups = useAtomComponentStateValue(
    currentRecordFilterGroupsComponentState,
    viewBarInstanceId,
  );
  const anyFieldFilterValue = useAtomComponentStateValue(
    anyFieldFilterValueComponentState,
    viewBarInstanceId,
  );
  const { filterValueDependencies } = useFilterValueDependencies();
  const flattenedFieldMetadataItems = useAtomStateValue(
    flattenedFieldMetadataItemsSelector,
  );

  const viewFilter = computeRecordGqlOperationFilter({
    filterValueDependencies,
    recordFilters: currentRecordFilters,
    recordFilterGroups: currentRecordFilterGroups,
    fieldMetadataItems: flattenedFieldMetadataItems,
  });

  const { recordGqlOperationFilter: anyFieldFilter } =
    turnAnyFieldFilterIntoRecordGqlFilter({
      fields: objectMetadataItem.readableFields,
      filterValue: anyFieldFilterValue,
    });

  return combineFilters([viewFilter, anyFieldFilter]);
};

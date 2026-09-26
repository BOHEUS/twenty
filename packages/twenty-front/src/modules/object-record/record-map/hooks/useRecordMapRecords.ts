import { type FieldMetadataItem } from '@/object-metadata/types/FieldMetadataItem';
import { useFindManyRecords } from '@/object-record/hooks/useFindManyRecords';
import { type RecordMapBounds } from '@/object-record/record-map/types/RecordMapBounds';
import { getRecordMapLocationFilter } from '@/object-record/record-map/utils/getRecordMapLocationFilter';
import { type ObjectRecord } from '@/object-record/types/ObjectRecord';
import { type OnFindManyRecordsCompleted } from '@/object-record/types/OnFindManyRecordsCompleted';
import { useCallback, useState } from 'react';
import { QUERY_MAX_RECORDS } from 'twenty-shared/constants';
import { type RecordGqlOperationFilter } from 'twenty-shared/types';
import { combineFilters, isDefined } from 'twenty-shared/utils';

type RecordMapLoadedRecords = {
  records: ObjectRecord[];
  totalCount: number;
};

type UseRecordMapRecordsParams = {
  objectNameSingular: string;
  viewFilter: RecordGqlOperationFilter;
  addressFieldMetadataItem: FieldMetadataItem;
  labelIdentifierFieldMetadataItem: FieldMetadataItem | undefined;
  bounds: RecordMapBounds | null;
  onRecordsLoaded: (records: ObjectRecord[]) => void;
};

export const useRecordMapRecords = ({
  objectNameSingular,
  viewFilter,
  addressFieldMetadataItem,
  labelIdentifierFieldMetadataItem,
  bounds,
  onRecordsLoaded,
}: UseRecordMapRecordsParams) => {
  // Kept across refetches so pins stay on screen while the next area loads.
  const [loadedRecords, setLoadedRecords] =
    useState<RecordMapLoadedRecords | null>(null);

  const handleCompleted = useCallback<OnFindManyRecordsCompleted<ObjectRecord>>(
    (records, options) => {
      setLoadedRecords({
        records,
        totalCount: options?.totalCount ?? records.length,
      });
      onRecordsLoaded(records);
    },
    [onRecordsLoaded],
  );

  const addressFieldName = addressFieldMetadataItem.name;

  useFindManyRecords({
    objectNameSingular,
    filter: combineFilters([
      getRecordMapLocationFilter({ addressFieldName, bounds }),
      viewFilter,
    ]),
    recordGqlFields: {
      id: true,
      [addressFieldName]: true,
      ...(isDefined(labelIdentifierFieldMetadataItem)
        ? { [labelIdentifierFieldMetadataItem.name]: true }
        : {}),
    },
    limit: QUERY_MAX_RECORDS,
    onCompleted: handleCompleted,
  });

  return loadedRecords;
};

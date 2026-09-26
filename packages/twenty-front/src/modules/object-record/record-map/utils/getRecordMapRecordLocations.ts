import { type FieldAddressValue } from '@/object-record/record-field/ui/types/FieldMetadata';
import { type ObjectRecord } from '@/object-record/types/ObjectRecord';
import { isDefined } from 'twenty-shared/utils';

type RecordMapRecordLocation = {
  record: ObjectRecord;
  longitude: number;
  latitude: number;
};

export const getRecordMapRecordLocations = (
  records: ObjectRecord[],
  addressFieldName: string,
): RecordMapRecordLocation[] =>
  records.flatMap((record) => {
    const address: FieldAddressValue | null | undefined =
      record[addressFieldName];

    return isDefined(address?.addressLat) && isDefined(address?.addressLng)
      ? [
          {
            record,
            longitude: address.addressLng,
            latitude: address.addressLat,
          },
        ]
      : [];
  });

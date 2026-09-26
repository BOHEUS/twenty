import { type EnrichedObjectMetadataItem } from '@/object-metadata/types/EnrichedObjectMetadataItem';
import { getActiveFieldMetadataItems } from '@/object-metadata/utils/getActiveFieldMetadataItems';
import { FieldMetadataType } from 'twenty-shared/types';

export const getRecordMapAddressFieldMetadataItem = (
  objectMetadataItem: Pick<EnrichedObjectMetadataItem, 'readableFields'>,
) =>
  getActiveFieldMetadataItems(objectMetadataItem).find(
    (fieldMetadataItem) => fieldMetadataItem.type === FieldMetadataType.ADDRESS,
  );

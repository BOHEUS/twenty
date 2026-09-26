import { getRecordMapAddressFieldMetadataItem } from '@/object-record/record-map/utils/getRecordMapAddressFieldMetadataItem';
import { getMockObjectMetadataItemOrThrow } from '~/testing/utils/getMockObjectMetadataItemOrThrow';
import { FieldMetadataType } from '~/generated-metadata/graphql';

describe('getRecordMapAddressFieldMetadataItem', () => {
  it('returns the active address field of the object', () => {
    const companyObjectMetadataItem =
      getMockObjectMetadataItemOrThrow('company');

    expect(
      getRecordMapAddressFieldMetadataItem(companyObjectMetadataItem)?.type,
    ).toBe(FieldMetadataType.ADDRESS);
  });

  it('ignores inactive address fields', () => {
    const companyObjectMetadataItem =
      getMockObjectMetadataItemOrThrow('company');

    expect(
      getRecordMapAddressFieldMetadataItem({
        readableFields: companyObjectMetadataItem.readableFields.map(
          (fieldMetadataItem) => ({ ...fieldMetadataItem, isActive: false }),
        ),
      }),
    ).toBeUndefined();
  });
});

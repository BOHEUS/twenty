import { buildMissingRecordTableWidgetViewFields } from '@/page-layout/widgets/record-table/utils/buildMissingRecordTableWidgetViewFields';
import { type ViewField } from '@/views/types/ViewField';
import { getMockFieldMetadataItemOrThrow } from '~/testing/utils/getMockFieldMetadataItemOrThrow';
import { getMockObjectMetadataItemOrThrow } from '~/testing/utils/getMockObjectMetadataItemOrThrow';

describe('buildMissingRecordTableWidgetViewFields', () => {
  const objectMetadataItem = getMockObjectMetadataItemOrThrow('person');

  const buildViewField = (fieldName: string, position: number): ViewField => {
    const fieldMetadataItem = getMockFieldMetadataItemOrThrow({
      objectMetadataItem,
      fieldName,
    });

    return {
      id: `view-field-${fieldName}`,
      fieldMetadataId: fieldMetadataItem.id,
      position,
      size: 150,
      isActive: true,
      isVisible: true,
    };
  };

  const viewFields = [
    buildViewField('name', 0),
    buildViewField('emails', 1),
    buildViewField('company', 2),
  ];

  const missingFieldItems = buildMissingRecordTableWidgetViewFields({
    viewId: 'view-id',
    viewFields,
    objectMetadataItem,
  });

  it('should offer eligible fields absent from the view as hidden fields', () => {
    const missingFieldNames = missingFieldItems.map(
      (item) => item.fieldMetadataItem.name,
    );

    expect(missingFieldNames).toEqual(
      expect.arrayContaining(['jobTitle', 'phones']),
    );
    expect(missingFieldNames).not.toEqual(
      expect.arrayContaining(['name', 'emails', 'company']),
    );
    expect(missingFieldNames).not.toContain('id');
    expect(missingFieldItems.every((item) => !item.viewField.isVisible)).toBe(
      true,
    );
  });

  it('should position missing fields after the existing ones', () => {
    expect(missingFieldItems.map((item) => item.viewField.position)).toEqual(
      missingFieldItems.map((_, index) => 3 + index),
    );
  });

  it('should return nothing when the view already holds every eligible field', () => {
    const allViewFields = [
      ...viewFields,
      ...missingFieldItems.map((item) => item.viewField),
    ];

    expect(
      buildMissingRecordTableWidgetViewFields({
        viewId: 'view-id',
        viewFields: allViewFields,
        objectMetadataItem,
      }),
    ).toEqual([]);
  });
});

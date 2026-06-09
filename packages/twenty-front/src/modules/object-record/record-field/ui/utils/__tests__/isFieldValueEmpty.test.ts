import {
  booleanFieldDefinition,
  fieldMetadataId,
  fullNameFieldDefinition,
  linksFieldDefinition,
  morphRelationFieldDefinition,
  relationFieldDefinition,
  richTextFieldDefinition,
  selectFieldDefinition,
} from '@/object-record/record-field/ui/__mocks__/fieldDefinitions';
import { type FieldDefinition } from '@/object-record/record-field/ui/types/FieldDefinition';
import {
  type FieldCurrencyMetadata,
  type FieldMetadata,
} from '@/object-record/record-field/ui/types/FieldMetadata';
import { FieldMetadataType } from '~/generated-metadata/graphql';

import { isFieldValueEmpty } from '@/object-record/record-field/ui/utils/isFieldValueEmpty';

const addressFieldDefinition = {
  fieldMetadataId,
  label: 'Address',
  type: FieldMetadataType.ADDRESS,
  iconName: 'IconMap',
  metadata: {
    fieldName: 'address',
    placeHolder: 'Address',
  },
} as FieldDefinition<FieldMetadata>;

const emptyAddressValue = {
  addressStreet1: null,
  addressStreet2: null,
  addressCity: null,
  addressState: null,
  addressPostcode: null,
  addressCountry: null,
  addressLat: null,
  addressLng: null,
};

describe('isFieldValueEmpty', () => {
  it('should return correct value for boolean field', () => {
    expect(
      isFieldValueEmpty({
        fieldDefinition: booleanFieldDefinition,
        fieldValue: null,
      }),
    ).toBe(true);
    expect(
      isFieldValueEmpty({
        fieldDefinition: booleanFieldDefinition,
        fieldValue: false,
      }),
    ).toBe(false);
    expect(
      isFieldValueEmpty({
        fieldDefinition: booleanFieldDefinition,
        fieldValue: true,
      }),
    ).toBe(false);
  });

  it('should return correct value for relation field', () => {
    expect(
      isFieldValueEmpty({
        fieldDefinition: relationFieldDefinition,
        fieldValue: null,
      }),
    ).toBe(true);
    expect(
      isFieldValueEmpty({
        fieldDefinition: relationFieldDefinition,
        fieldValue: { foo: 'bar' },
      }),
    ).toBe(false);
    expect(
      isFieldValueEmpty({
        fieldDefinition: relationFieldDefinition,
        fieldValue: [],
      }),
    ).toBe(true);
    expect(
      isFieldValueEmpty({
        fieldDefinition: relationFieldDefinition,
        fieldValue: [{ id: '123' }],
      }),
    ).toBe(false);
  });

  it('should return correct value for select field', () => {
    // If the value does not match the fieldDefinition, it will always return `false`
    // Should it return `false` or `true` if the fieldValue doesn't match?
    expect(
      isFieldValueEmpty({
        fieldDefinition: selectFieldDefinition,
        fieldValue: '',
      }),
    ).toBe(false);
  });

  it('should return correct value for currency field', () => {
    const fieldDefinition: FieldDefinition<FieldCurrencyMetadata> = {
      fieldMetadataId,
      label: 'Annual Income',
      iconName: 'cashCow',
      type: FieldMetadataType.CURRENCY,
      metadata: {
        fieldName: 'annualIncome',
        placeHolder: '100000',
        isPositive: true,
      },
    };

    expect(
      isFieldValueEmpty({
        fieldDefinition,
        fieldValue: { currencyCode: 'USD', amountMicros: 1000000 },
      }),
    ).toBe(false);
    expect(
      isFieldValueEmpty({
        fieldDefinition,
        fieldValue: { currencyCode: 'USD' },
      }),
    ).toBe(true);
  });

  it('should return correct value for fullname field', () => {
    expect(
      isFieldValueEmpty({
        fieldDefinition: fullNameFieldDefinition,
        fieldValue: { firstName: '', lastName: '' },
      }),
    ).toBe(true);
    expect(
      isFieldValueEmpty({
        fieldDefinition: fullNameFieldDefinition,
        fieldValue: { firstName: 'Sheldon', lastName: '' },
      }),
    ).toBe(false);
  });

  it('should return correct value for links field', () => {
    // Empty cases
    expect(
      isFieldValueEmpty({
        fieldDefinition: linksFieldDefinition,
        fieldValue: {
          primaryLinkUrl: null,
          primaryLinkLabel: null,
          secondaryLinks: [],
        },
      }),
    ).toBe(true);

    expect(
      isFieldValueEmpty({
        fieldDefinition: linksFieldDefinition,
        fieldValue: null,
      }),
    ).toBe(true);

    // Valid primary link only
    expect(
      isFieldValueEmpty({
        fieldDefinition: linksFieldDefinition,
        fieldValue: {
          primaryLinkUrl: 'https://www.twenty.com',
          primaryLinkLabel: 'Twenty Website',
          secondaryLinks: [],
        },
      }),
    ).toBe(false);

    // Valid secondary link only
    expect(
      isFieldValueEmpty({
        fieldDefinition: linksFieldDefinition,
        fieldValue: {
          primaryLinkUrl: null,
          primaryLinkLabel: null,
          secondaryLinks: [
            { url: 'https://docs.twenty.com', label: 'Documentation' },
          ],
        },
      }),
    ).toBe(false);

    // Invalid primary link but valid secondary link
    expect(
      isFieldValueEmpty({
        fieldDefinition: linksFieldDefinition,
        fieldValue: {
          primaryLinkUrl: 'lydia,com',
          primaryLinkLabel: 'Invalid URL',
          secondaryLinks: [
            { url: 'https://docs.twenty.com', label: 'Documentation' },
          ],
        },
      }),
    ).toBe(false);

    // Valid primary link but invalid secondary link
    expect(
      isFieldValueEmpty({
        fieldDefinition: linksFieldDefinition,
        fieldValue: {
          primaryLinkUrl: 'https://www.twenty.com',
          primaryLinkLabel: 'Twenty Website',
          secondaryLinks: [{ url: 'wikipedia', label: 'Invalid URL' }],
        },
      }),
    ).toBe(false);

    // All invalid links
    expect(
      isFieldValueEmpty({
        fieldDefinition: linksFieldDefinition,
        fieldValue: {
          primaryLinkUrl: 'lydia,com',
          primaryLinkLabel: 'Invalid URL',
          secondaryLinks: [{ url: 'wikipedia', label: 'Invalid URL' }],
        },
      }),
    ).toBe(true);

    // Multiple secondary links with mix of valid and invalid
    expect(
      isFieldValueEmpty({
        fieldDefinition: linksFieldDefinition,
        fieldValue: {
          primaryLinkUrl: null,
          primaryLinkLabel: null,
          secondaryLinks: [
            { url: 'wikipedia', label: 'Invalid URL' },
            { url: 'https://docs.twenty.com', label: 'Documentation' },
          ],
        },
      }),
    ).toBe(false);
  });

  it('should return correct value for rich text field', () => {
    expect(
      isFieldValueEmpty({
        fieldDefinition: richTextFieldDefinition,
        fieldValue: null,
      }),
    ).toBe(true);

    expect(
      isFieldValueEmpty({
        fieldDefinition: richTextFieldDefinition,
        fieldValue: { blocknote: null, markdown: null },
      }),
    ).toBe(true);

    expect(
      isFieldValueEmpty({
        fieldDefinition: richTextFieldDefinition,
        fieldValue: { blocknote: '', markdown: null },
      }),
    ).toBe(true);

    expect(
      isFieldValueEmpty({
        fieldDefinition: richTextFieldDefinition,
        fieldValue: { blocknote: '[{"type":"paragraph"}]', markdown: null },
      }),
    ).toBe(false);

    expect(
      isFieldValueEmpty({
        fieldDefinition: richTextFieldDefinition,
        fieldValue: {
          blocknote: '[{"type":"paragraph"}]',
          markdown: 'some text',
        },
      }),
    ).toBe(false);
  });

  it('should return true for an address with every subfield empty', () => {
    expect(
      isFieldValueEmpty({
        fieldDefinition: addressFieldDefinition,
        fieldValue: emptyAddressValue,
      }),
    ).toBe(true);

    expect(
      isFieldValueEmpty({
        fieldDefinition: addressFieldDefinition,
        fieldValue: null,
      }),
    ).toBe(true);

    expect(
      isFieldValueEmpty({
        fieldDefinition: addressFieldDefinition,
        fieldValue: undefined,
      }),
    ).toBe(true);
  });

  it('should return false when only the city is filled and street1 is null', () => {
    expect(
      isFieldValueEmpty({
        fieldDefinition: addressFieldDefinition,
        fieldValue: {
          __typename: 'Address',
          ...emptyAddressValue,
          addressCity: 'Mountain View',
        },
      }),
    ).toBe(false);
  });

  it('should return false for a populated address even when coordinates are strings', () => {
    expect(
      isFieldValueEmpty({
        fieldDefinition: addressFieldDefinition,
        fieldValue: {
          ...emptyAddressValue,
          addressStreet1: '1 Infinite Loop',
          addressCity: 'Cupertino',
          addressLat: '37.3318',
          addressLng: '-122.0312',
        },
      }),
    ).toBe(false);
  });

  it('should return true for an address that only has coordinates and no text', () => {
    expect(
      isFieldValueEmpty({
        fieldDefinition: addressFieldDefinition,
        fieldValue: {
          ...emptyAddressValue,
          addressLat: 37.3318,
          addressLng: -122.0312,
        },
      }),
    ).toBe(true);
  });

  it('should respect configured subFields when computing emptiness', () => {
    const streetOnlyAddressFieldDefinition = {
      ...addressFieldDefinition,
      metadata: {
        ...addressFieldDefinition.metadata,
        settings: { subFields: ['addressStreet1'] },
      },
    } as FieldDefinition<FieldMetadata>;

    expect(
      isFieldValueEmpty({
        fieldDefinition: streetOnlyAddressFieldDefinition,
        fieldValue: { ...emptyAddressValue, addressCity: 'Cupertino' },
      }),
    ).toBe(true);

    expect(
      isFieldValueEmpty({
        fieldDefinition: streetOnlyAddressFieldDefinition,
        fieldValue: { ...emptyAddressValue, addressStreet1: '1 Infinite Loop' },
      }),
    ).toBe(false);
  });

  it('should return correct value for morph relation field', () => {
    expect(
      isFieldValueEmpty({
        fieldDefinition: morphRelationFieldDefinition,
        fieldValue: null,
      }),
    ).toBe(true);
    expect(
      isFieldValueEmpty({
        fieldDefinition: morphRelationFieldDefinition,
        fieldValue: [{ value: null }, { value: [] }],
      }),
    ).toBe(true);
    expect(
      isFieldValueEmpty({
        fieldDefinition: morphRelationFieldDefinition,
        fieldValue: [{ value: [{ id: '123' }] }],
      }),
    ).toBe(false);
  });
});

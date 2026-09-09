import { FieldMetadataType } from 'twenty-shared/types';

import { type ObjectMetadataForToolSchema } from 'src/engine/core-modules/record-crud/types/object-metadata-for-tool-schema.type';
import { generateRecordPropertiesZodSchema } from 'src/engine/core-modules/record-crud/zod-schemas/record-properties.zod-schema';

const objectWithPhonesField = {
  fields: [
    {
      id: 'ea8b5c6d-4d3a-4f6d-9a1f-2b1c3d4e5f6a',
      name: 'phones',
      type: FieldMetadataType.PHONES,
      isNullable: true,
    },
  ],
} as ObjectMetadataForToolSchema;

describe('generateRecordPropertiesZodSchema', () => {
  describe('PHONES', () => {
    // Regression for the AI record-creation bug: additionalPhones was
    // advertised as a list of strings, so the agent sent raw numbers that the
    // record transformer read as objects and stored as empty phone entries.
    it('accepts additionalPhones as phone objects', () => {
      const schema = generateRecordPropertiesZodSchema(objectWithPhonesField);

      expect(
        schema.parse({
          phones: {
            primaryPhoneNumber: '+14155552671',
            additionalPhones: [
              {
                number: '+442071838750',
                countryCode: 'GB',
                callingCode: '+44',
              },
            ],
          },
        }),
      ).toEqual({
        phones: {
          primaryPhoneNumber: '+14155552671',
          additionalPhones: [
            { number: '+442071838750', countryCode: 'GB', callingCode: '+44' },
          ],
        },
      });
    });

    it('rejects additionalPhones entries that are bare strings', () => {
      const schema = generateRecordPropertiesZodSchema(objectWithPhonesField);

      expect(() =>
        schema.parse({
          phones: { additionalPhones: ['+442071838750'] },
        }),
      ).toThrow();
    });
  });
});

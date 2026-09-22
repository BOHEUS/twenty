import { describe, expect, it } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

import {
  APP_VIEW_FIELD_START_POSITION,
  COMPANY_INDEX_VIEW_UNIVERSAL_IDENTIFIER,
  PERSON_INDEX_VIEW_UNIVERSAL_IDENTIFIER,
} from 'src/constants/standard-index-views';

const VIEW_FIELDS_DIRECTORY = path.join(process.cwd(), 'src/view-fields');

const loadViewFields = async (objectName: 'person' | 'company') => {
  const directory = path.join(VIEW_FIELDS_DIRECTORY, objectName);

  return Promise.all(
    fs
      .readdirSync(directory)
      .filter((file) => file.endsWith('.view-field.ts'))
      .map(async (file) => {
        const imported = await import(
          `src/view-fields/${objectName}/${file.replace(/\.ts$/, '')}`
        );

        return imported.default.config;
      }),
  );
};

describe('standard index view fields', () => {
  it('should attach every person field to the standard person index view', async () => {
    const viewFields = await loadViewFields('person');

    expect(viewFields).toHaveLength(14);
    for (const viewField of viewFields) {
      expect(viewField.viewUniversalIdentifier).toBe(
        PERSON_INDEX_VIEW_UNIVERSAL_IDENTIFIER,
      );
    }
  });

  it('should attach every company field to the standard company index view', async () => {
    const viewFields = await loadViewFields('company');

    expect(viewFields).toHaveLength(12);
    for (const viewField of viewFields) {
      expect(viewField.viewUniversalIdentifier).toBe(
        COMPANY_INDEX_VIEW_UNIVERSAL_IDENTIFIER,
      );
    }
  });

  it('should stay hidden and clear of the standard field positions', async () => {
    const viewFields = [
      ...(await loadViewFields('person')),
      ...(await loadViewFields('company')),
    ];

    for (const viewField of viewFields) {
      expect(viewField.isVisible).toBe(false);
      expect(viewField.position).toBeGreaterThanOrEqual(
        APP_VIEW_FIELD_START_POSITION,
      );
    }
  });

  it('should give each view field its own identifier and position per view', async () => {
    for (const objectName of ['person', 'company'] as const) {
      const viewFields = await loadViewFields(objectName);
      const identifiers = viewFields.map((field) => field.universalIdentifier);
      const positions = viewFields.map((field) => field.position);

      expect(new Set(identifiers).size).toBe(viewFields.length);
      expect(new Set(positions).size).toBe(viewFields.length);
    }
  });
});

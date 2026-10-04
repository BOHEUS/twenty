import { STANDARD_OBJECTS } from 'twenty-shared/metadata';
import { FieldMetadataType } from 'twenty-shared/types';

import {
  buildCallInverseFieldRenameUpdates,
  buildCallObjectRenameUpdates,
  findCallInverseFieldNameCollisions,
  findCallObjectNameCollisions,
} from 'src/database/commands/upgrade-version-command/2-46/utils/call-name-collision.util';
import { type FlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/types/flat-entity-maps.type';
import { getFlatFieldMetadataMock } from 'src/engine/metadata-modules/flat-field-metadata/__mocks__/get-flat-field-metadata.mock';
import { type FlatFieldMetadata } from 'src/engine/metadata-modules/flat-field-metadata/types/flat-field-metadata.type';
import { getFlatObjectMetadataMock } from 'src/engine/metadata-modules/flat-object-metadata/__mocks__/get-flat-object-metadata.mock';
import { type FlatObjectMetadata } from 'src/engine/metadata-modules/flat-object-metadata/types/flat-object-metadata.type';

const NOW = '2026-10-04T00:00:00.000Z';

const buildMaps = <T extends FlatObjectMetadata | FlatFieldMetadata>(
  entities: T[],
): FlatEntityMaps<T> => ({
  byUniversalIdentifier: Object.fromEntries(
    entities.map((entity) => [entity.universalIdentifier, entity]),
  ),
  universalIdentifierById: Object.fromEntries(
    entities.map((entity) => [entity.id, entity.universalIdentifier]),
  ),
  universalIdentifiersByApplicationId: {},
});

const companyField = (
  overrides: Pick<FlatFieldMetadata, 'name' | 'universalIdentifier'>,
): FlatFieldMetadata =>
  getFlatFieldMetadataMock({
    objectMetadataId: 'company-object-id',
    objectMetadataUniversalIdentifier: STANDARD_OBJECTS.company.universalIdentifier,
    type: FieldMetadataType.TEXT,
    label: overrides.name,
    ...overrides,
  });

describe('findCallObjectNameCollisions', () => {
  it('ignores unrelated objects and the standard call objects themselves', () => {
    const maps = buildMaps<FlatObjectMetadata>([
      getFlatObjectMetadataMock({
        universalIdentifier: 'invoice',
        nameSingular: 'invoice',
        namePlural: 'invoices',
      }),
      getFlatObjectMetadataMock({
        universalIdentifier: STANDARD_OBJECTS.call.universalIdentifier,
        nameSingular: 'call',
        namePlural: 'calls',
      }),
    ]);

    expect(findCallObjectNameCollisions(maps)).toEqual([]);
  });

  it('returns custom objects colliding on either name of either object', () => {
    const maps = buildMaps<FlatObjectMetadata>([
      getFlatObjectMetadataMock({
        universalIdentifier: 'custom-call',
        nameSingular: 'call',
        namePlural: 'phoneCalls',
      }),
      getFlatObjectMetadataMock({
        universalIdentifier: 'custom-participants',
        nameSingular: 'attendee',
        namePlural: 'callParticipants',
      }),
    ]);

    expect(
      findCallObjectNameCollisions(maps).map(
        (object) => object.universalIdentifier,
      ),
    ).toEqual(['custom-call', 'custom-participants']);
  });
});

describe('buildCallObjectRenameUpdates', () => {
  it('suffixes the colliding object with Old and unsyncs its label', () => {
    const maps = buildMaps<FlatObjectMetadata>([
      getFlatObjectMetadataMock({
        universalIdentifier: 'custom-call',
        nameSingular: 'call',
        namePlural: 'calls',
        labelSingular: 'Call',
        labelPlural: 'Calls',
        isLabelSyncedWithName: true,
      }),
    ]);

    expect(
      buildCallObjectRenameUpdates({ flatObjectMetadataMaps: maps, now: NOW }),
    ).toMatchObject([
      {
        universalIdentifier: 'custom-call',
        nameSingular: 'callOld',
        namePlural: 'callsOld',
        labelSingular: 'Call (Old)',
        labelPlural: 'Calls (Old)',
        isLabelSyncedWithName: false,
        updatedAt: NOW,
      },
    ]);
  });

  it('skips a discriminator when only the plural Old name is taken', () => {
    const maps = buildMaps<FlatObjectMetadata>([
      getFlatObjectMetadataMock({
        universalIdentifier: 'custom-call',
        nameSingular: 'call',
        namePlural: 'calls',
      }),
      getFlatObjectMetadataMock({
        universalIdentifier: 'plural-taken',
        nameSingular: 'archive',
        namePlural: 'callsOld',
      }),
    ]);

    expect(
      buildCallObjectRenameUpdates({ flatObjectMetadataMaps: maps, now: NOW }),
    ).toMatchObject([{ nameSingular: 'callOld2', namePlural: 'callsOld2' }]);
  });

  it('picks the next free discriminator when callOld is taken', () => {
    const maps = buildMaps<FlatObjectMetadata>([
      getFlatObjectMetadataMock({
        universalIdentifier: 'custom-call',
        nameSingular: 'call',
        namePlural: 'calls',
      }),
      getFlatObjectMetadataMock({
        universalIdentifier: 'already-old',
        nameSingular: 'callOld',
        namePlural: 'callsOld',
      }),
    ]);

    expect(
      buildCallObjectRenameUpdates({ flatObjectMetadataMaps: maps, now: NOW }),
    ).toMatchObject([{ nameSingular: 'callOld2', namePlural: 'callsOld2' }]);
  });
});

describe('inverse field collisions', () => {
  it('ignores the standard inverse field and fields on other objects', () => {
    const maps = buildMaps<FlatFieldMetadata>([
      companyField({
        name: 'calls',
        universalIdentifier:
          STANDARD_OBJECTS.company.fields.calls.universalIdentifier,
      }),
      getFlatFieldMetadataMock({
        objectMetadataId: 'task-object-id',
        objectMetadataUniversalIdentifier:
          STANDARD_OBJECTS.task.universalIdentifier,
        type: FieldMetadataType.TEXT,
        name: 'calls',
        label: 'Calls',
        universalIdentifier: 'task-calls',
      }),
    ]);

    expect(findCallInverseFieldNameCollisions(maps)).toEqual([]);
  });

  it('renames a custom company field named calls', () => {
    const maps = buildMaps<FlatFieldMetadata>([
      companyField({ name: 'calls', universalIdentifier: 'custom-calls' }),
      companyField({ name: 'callsOld', universalIdentifier: 'taken' }),
    ]);

    expect(
      buildCallInverseFieldRenameUpdates({
        flatFieldMetadataMaps: maps,
        now: NOW,
      }),
    ).toMatchObject([
      {
        universalIdentifier: 'custom-calls',
        name: 'callsOld2',
        label: 'calls (Old) 2',
        isLabelSyncedWithName: false,
        updatedAt: NOW,
      },
    ]);
  });
});

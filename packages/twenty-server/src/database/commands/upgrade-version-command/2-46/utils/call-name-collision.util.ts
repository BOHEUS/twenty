import { STANDARD_OBJECTS } from 'twenty-shared/metadata';
import { isDefined } from 'twenty-shared/utils';

import { type FlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/types/flat-entity-maps.type';
import { type FlatFieldMetadata } from 'src/engine/metadata-modules/flat-field-metadata/types/flat-field-metadata.type';
import { type FlatObjectMetadata } from 'src/engine/metadata-modules/flat-object-metadata/types/flat-object-metadata.type';

const OLD_NAME_SUFFIX = 'Old';
const OLD_LABEL_SUFFIX = ' (Old)';
const MAX_OLD_NAME_ATTEMPTS = 100;

const CALL_STANDARD_OBJECT_NAMES = [
  {
    universalIdentifier: STANDARD_OBJECTS.call.universalIdentifier,
    nameSingular: 'call',
    namePlural: 'calls',
  },
  {
    universalIdentifier: STANDARD_OBJECTS.callParticipant.universalIdentifier,
    nameSingular: 'callParticipant',
    namePlural: 'callParticipants',
  },
];

// Inverse relation fields the call objects add to objects that already exist
const CALL_INVERSE_FIELDS = [
  {
    objectUniversalIdentifier: STANDARD_OBJECTS.company.universalIdentifier,
    field: STANDARD_OBJECTS.company.fields.calls,
    name: 'calls',
  },
  {
    objectUniversalIdentifier: STANDARD_OBJECTS.opportunity.universalIdentifier,
    field: STANDARD_OBJECTS.opportunity.fields.calls,
    name: 'calls',
  },
  {
    objectUniversalIdentifier: STANDARD_OBJECTS.person.universalIdentifier,
    field: STANDARD_OBJECTS.person.fields.callParticipants,
    name: 'callParticipants',
  },
  {
    objectUniversalIdentifier:
      STANDARD_OBJECTS.workspaceMember.universalIdentifier,
    field: STANDARD_OBJECTS.workspaceMember.fields.ownedCalls,
    name: 'ownedCalls',
  },
  {
    objectUniversalIdentifier:
      STANDARD_OBJECTS.workspaceMember.universalIdentifier,
    field: STANDARD_OBJECTS.workspaceMember.fields.callParticipants,
    name: 'callParticipants',
  },
];

export const CALL_INVERSE_FIELD_UNIVERSAL_IDENTIFIERS = CALL_INVERSE_FIELDS.map(
  ({ field }) => field.universalIdentifier,
);

// Every base name must be free under the same discriminator, so an object's
// singular and plural stay paired.
const resolveAvailableOldNames = ({
  baseNames,
  takenNames,
}: {
  baseNames: string[];
  takenNames: ReadonlySet<string>;
}): { names: string[]; discriminator: string } => {
  for (let attempt = 0; attempt < MAX_OLD_NAME_ATTEMPTS; attempt++) {
    const discriminator = attempt === 0 ? '' : `${attempt + 1}`;
    const names = baseNames.map(
      (baseName) => `${baseName}${OLD_NAME_SUFFIX}${discriminator}`,
    );

    if (names.every((name) => !takenNames.has(name))) {
      return { names, discriminator };
    }
  }

  throw new Error(
    `Could not find an available ${baseNames.join('/')}${OLD_NAME_SUFFIX} name after ${MAX_OLD_NAME_ATTEMPTS} attempts`,
  );
};

export const findCallObjectNameCollisions = (
  flatObjectMetadataMaps: FlatEntityMaps<FlatObjectMetadata>,
): FlatObjectMetadata[] =>
  Object.values(flatObjectMetadataMaps.byUniversalIdentifier).filter(
    (flatObjectMetadata): flatObjectMetadata is FlatObjectMetadata =>
      isDefined(flatObjectMetadata) &&
      CALL_STANDARD_OBJECT_NAMES.some(
        ({ universalIdentifier, nameSingular, namePlural }) =>
          flatObjectMetadata.universalIdentifier !== universalIdentifier &&
          [flatObjectMetadata.nameSingular, flatObjectMetadata.namePlural].some(
            (name) => name === nameSingular || name === namePlural,
          ),
      ),
  );

export const buildCallObjectRenameUpdates = ({
  flatObjectMetadataMaps,
  now,
}: {
  flatObjectMetadataMaps: FlatEntityMaps<FlatObjectMetadata>;
  now: string;
}): FlatObjectMetadata[] => {
  const takenNames = new Set(
    Object.values(flatObjectMetadataMaps.byUniversalIdentifier)
      .filter(isDefined)
      .flatMap((flatObjectMetadata) => [
        flatObjectMetadata.nameSingular,
        flatObjectMetadata.namePlural,
      ]),
  );

  return findCallObjectNameCollisions(flatObjectMetadataMaps).map(
    (collidingObjectMetadata) => {
      const {
        names: [nameSingular, namePlural],
        discriminator,
      } = resolveAvailableOldNames({
        baseNames: [
          collidingObjectMetadata.nameSingular,
          collidingObjectMetadata.namePlural,
        ],
        takenNames,
      });
      const labelSuffix =
        discriminator === ''
          ? OLD_LABEL_SUFFIX
          : `${OLD_LABEL_SUFFIX} ${discriminator}`;

      takenNames.add(nameSingular);
      takenNames.add(namePlural);

      return {
        ...collidingObjectMetadata,
        nameSingular,
        namePlural,
        labelSingular: `${collidingObjectMetadata.labelSingular}${labelSuffix}`,
        labelPlural: `${collidingObjectMetadata.labelPlural}${labelSuffix}`,
        isLabelSyncedWithName: false,
        updatedAt: now,
      };
    },
  );
};

export const findCallInverseFieldNameCollisions = (
  flatFieldMetadataMaps: FlatEntityMaps<FlatFieldMetadata>,
): FlatFieldMetadata[] =>
  Object.values(flatFieldMetadataMaps.byUniversalIdentifier).filter(
    (flatFieldMetadata): flatFieldMetadata is FlatFieldMetadata =>
      isDefined(flatFieldMetadata) &&
      !CALL_INVERSE_FIELD_UNIVERSAL_IDENTIFIERS.includes(
        flatFieldMetadata.universalIdentifier,
      ) &&
      CALL_INVERSE_FIELDS.some(
        ({ objectUniversalIdentifier, name }) =>
          flatFieldMetadata.objectMetadataUniversalIdentifier ===
            objectUniversalIdentifier && flatFieldMetadata.name === name,
      ),
  );

export const buildCallInverseFieldRenameUpdates = ({
  flatFieldMetadataMaps,
  now,
}: {
  flatFieldMetadataMaps: FlatEntityMaps<FlatFieldMetadata>;
  now: string;
}): FlatFieldMetadata[] => {
  const takenNamesByObjectUniversalIdentifier = new Map<string, Set<string>>();

  for (const flatFieldMetadata of Object.values(
    flatFieldMetadataMaps.byUniversalIdentifier,
  ).filter(isDefined)) {
    const takenNames =
      takenNamesByObjectUniversalIdentifier.get(
        flatFieldMetadata.objectMetadataUniversalIdentifier,
      ) ?? new Set<string>();

    takenNames.add(flatFieldMetadata.name);
    takenNamesByObjectUniversalIdentifier.set(
      flatFieldMetadata.objectMetadataUniversalIdentifier,
      takenNames,
    );
  }

  return findCallInverseFieldNameCollisions(flatFieldMetadataMaps).map(
    (collidingFieldMetadata) => {
      const takenNames =
        takenNamesByObjectUniversalIdentifier.get(
          collidingFieldMetadata.objectMetadataUniversalIdentifier,
        ) ?? new Set<string>();
      const {
        names: [name],
        discriminator,
      } = resolveAvailableOldNames({
        baseNames: [collidingFieldMetadata.name],
        takenNames,
      });
      const labelSuffix =
        discriminator === ''
          ? OLD_LABEL_SUFFIX
          : `${OLD_LABEL_SUFFIX} ${discriminator}`;

      takenNames.add(name);

      return {
        ...collidingFieldMetadata,
        name,
        label: `${collidingFieldMetadata.label}${labelSuffix}`,
        isLabelSyncedWithName: false,
        updatedAt: now,
      };
    },
  );
};

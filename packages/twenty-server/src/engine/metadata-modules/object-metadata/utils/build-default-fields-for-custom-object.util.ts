import { FieldMetadataType } from 'twenty-shared/types';
import { v4 } from 'uuid';

import { FieldMetadataEntity } from 'src/engine/metadata-modules/field-metadata/field-metadata.entity';
import { FlatFieldMetadata } from 'src/engine/metadata-modules/flat-field-metadata/types/flat-field-metadata.type';
import {
  BASE_OBJECT_STANDARD_FIELD_IDS,
  CUSTOM_OBJECT_STANDARD_FIELD_IDS,
} from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';

export const buildDefaultFieldsForCustomObject = (
  workspaceId: string,
): Partial<FieldMetadataEntity>[] => [
  {
    id: v4(),
    standardId: BASE_OBJECT_STANDARD_FIELD_IDS.id,
    type: FieldMetadataType.UUID,
    name: 'id',
    label: 'Id',
    icon: 'Icon123',
    description: 'Id',
    isNullable: false,
    isActive: true,
    isCustom: false,
    isSystem: true,
    workspaceId,
    defaultValue: 'uuid',
  },
  {
    id: v4(),
    standardId: CUSTOM_OBJECT_STANDARD_FIELD_IDS.name,
    type: FieldMetadataType.TEXT,
    name: 'name',
    label: 'Name',
    icon: 'IconAbc',
    description: 'Name',
    isNullable: false,
    isActive: true,
    isCustom: false,
    workspaceId,
    defaultValue: "'Untitled'",
  },
  {
    id: v4(),
    standardId: BASE_OBJECT_STANDARD_FIELD_IDS.createdAt,
    type: FieldMetadataType.DATE_TIME,
    name: 'createdAt',
    label: 'Creation date',
    icon: 'IconCalendar',
    description: 'Creation date',
    isNullable: false,
    isActive: true,
    isCustom: false,
    workspaceId,
    defaultValue: 'now',
  },
  {
    id: v4(),
    standardId: BASE_OBJECT_STANDARD_FIELD_IDS.updatedAt,
    type: FieldMetadataType.DATE_TIME,
    name: 'updatedAt',
    label: 'Last update',
    icon: 'IconCalendarClock',
    description: 'Last time the record was changed',
    isNullable: false,
    isActive: true,
    isCustom: false,
    isSystem: false,
    workspaceId,
    defaultValue: 'now',
  },
  {
    id: v4(),
    standardId: BASE_OBJECT_STANDARD_FIELD_IDS.deletedAt,
    type: FieldMetadataType.DATE_TIME,
    name: 'deletedAt',
    label: 'Deleted at',
    icon: 'IconCalendarClock',
    description: 'Deletion date',
    isNullable: true,
    isActive: true,
    isCustom: false,
    isSystem: false,
    workspaceId,
    defaultValue: null,
  },
  {
    id: v4(),
    standardId: CUSTOM_OBJECT_STANDARD_FIELD_IDS.createdBy,
    type: FieldMetadataType.ACTOR,
    name: 'createdBy',
    label: 'Created by',
    icon: 'IconCreativeCommonsSa',
    description: 'The creator of the record',
    isNullable: false,
    isActive: true,
    isCustom: false,
    isSystem: false,
    workspaceId,
    defaultValue: { name: "''", source: "'MANUAL'" },
  },
  {
    id: v4(),
    standardId: CUSTOM_OBJECT_STANDARD_FIELD_IDS.position,
    type: FieldMetadataType.POSITION,
    name: 'position',
    label: 'Position',
    icon: 'IconHierarchy2',
    description: 'Position',
    isNullable: false,
    isActive: true,
    isCustom: false,
    isSystem: true,
    workspaceId,
    defaultValue: 0,
  },
];

type BuildDefaultFlatFieldMetadataForCustomObjectArgs = {
  workspaceId: string;
  objectMetadataId: string;
};

export const buildDefaultFlatFieldMetadataForCustomObject = ({
  workspaceId,
  objectMetadataId,
}: BuildDefaultFlatFieldMetadataForCustomObjectArgs) => {
  const idField: FlatFieldMetadata<FieldMetadataType.UUID> = {
    type: FieldMetadataType.UUID,
    id: v4(),
    isLabelSyncedWithName: false,
    isUnique: true,
    objectMetadataId,
    uniqueIdentifier: BASE_OBJECT_STANDARD_FIELD_IDS.id,
    workspaceId,
    standardId: BASE_OBJECT_STANDARD_FIELD_IDS.id,
    name: 'id',
    label: 'Id',
    icon: 'Icon123',
    description: 'Id',
    isNullable: false,
    isActive: true,
    isCustom: false,
    isSystem: true,
    defaultValue: 'uuid',

    flatRelationTargetFieldMetadata: null,
    flatRelationTargetObjectMetadata: null,
    options: null,
    standardOverrides: null,
    relationTargetFieldMetadataId: null,
    relationTargetObjectMetadataId: null,
    settings: null,
  };

  const nameField: FlatFieldMetadata<FieldMetadataType.TEXT> = {
    type: FieldMetadataType.TEXT,
    id: v4(),
    isLabelSyncedWithName: false,
    isUnique: false,
    objectMetadataId,
    uniqueIdentifier: CUSTOM_OBJECT_STANDARD_FIELD_IDS.name,
    workspaceId,
    standardId: CUSTOM_OBJECT_STANDARD_FIELD_IDS.name,
    name: 'name',
    label: 'Name',
    icon: 'IconAbc',
    description: 'Name',
    isNullable: false,
    isActive: true,
    isCustom: false,
    isSystem: false,
    defaultValue: "'Untitled'",

    flatRelationTargetFieldMetadata: null,
    flatRelationTargetObjectMetadata: null,
    options: null,
    standardOverrides: null,
    relationTargetFieldMetadataId: null,
    relationTargetObjectMetadataId: null,
    settings: null,
  };

  const createdAtField: FlatFieldMetadata<FieldMetadataType.DATE_TIME> = {
    type: FieldMetadataType.DATE_TIME,
    id: v4(),
    isLabelSyncedWithName: false,
    isUnique: false,
    objectMetadataId,
    uniqueIdentifier: BASE_OBJECT_STANDARD_FIELD_IDS.createdAt,
    workspaceId,
    standardId: BASE_OBJECT_STANDARD_FIELD_IDS.createdAt,
    name: 'createdAt',
    label: 'Creation date',
    icon: 'IconCalendar',
    description: 'Creation date',
    isNullable: false,
    isActive: true,
    isCustom: false,
    isSystem: false,
    defaultValue: 'now',

    flatRelationTargetFieldMetadata: null,
    flatRelationTargetObjectMetadata: null,
    options: null,
    standardOverrides: null,
    relationTargetFieldMetadataId: null,
    relationTargetObjectMetadataId: null,
    settings: null,
  };

  const updatedAtField: FlatFieldMetadata<FieldMetadataType.DATE_TIME> = {
    type: FieldMetadataType.DATE_TIME,
    id: v4(),
    isLabelSyncedWithName: false,
    isUnique: false,
    objectMetadataId,
    uniqueIdentifier: BASE_OBJECT_STANDARD_FIELD_IDS.updatedAt,
    workspaceId,
    standardId: BASE_OBJECT_STANDARD_FIELD_IDS.updatedAt,
    name: 'updatedAt',
    label: 'Last update',
    icon: 'IconCalendarClock',
    description: 'Last time the record was changed',
    isNullable: false,
    isActive: true,
    isCustom: false,
    isSystem: false,
    defaultValue: 'now',

    flatRelationTargetFieldMetadata: null,
    flatRelationTargetObjectMetadata: null,
    options: null,
    standardOverrides: null,
    relationTargetFieldMetadataId: null,
    relationTargetObjectMetadataId: null,
    settings: null,
  };

  const deletedAtField: FlatFieldMetadata<FieldMetadataType.DATE_TIME> = {
    type: FieldMetadataType.DATE_TIME,
    id: v4(),
    isLabelSyncedWithName: false,
    isUnique: false,
    objectMetadataId,
    uniqueIdentifier: BASE_OBJECT_STANDARD_FIELD_IDS.deletedAt,
    workspaceId,
    standardId: BASE_OBJECT_STANDARD_FIELD_IDS.deletedAt,
    name: 'deletedAt',
    label: 'Deleted at',
    icon: 'IconCalendarClock',
    description: 'Deletion date',
    isNullable: true,
    isActive: true,
    isCustom: false,
    isSystem: false,
    defaultValue: null,

    flatRelationTargetFieldMetadata: null,
    flatRelationTargetObjectMetadata: null,
    options: null,
    standardOverrides: null,
    relationTargetFieldMetadataId: null,
    relationTargetObjectMetadataId: null,
    settings: null,
  };

  const createdByField: FlatFieldMetadata<FieldMetadataType.ACTOR> = {
    type: FieldMetadataType.ACTOR,
    id: v4(),
    isLabelSyncedWithName: false,
    isUnique: false,
    objectMetadataId,
    uniqueIdentifier: CUSTOM_OBJECT_STANDARD_FIELD_IDS.createdBy,
    workspaceId,
    standardId: CUSTOM_OBJECT_STANDARD_FIELD_IDS.createdBy,
    name: 'createdBy',
    label: 'Created by',
    icon: 'IconCreativeCommonsSa',
    description: 'The creator of the record',
    isNullable: false,
    isActive: true,
    isCustom: false,
    isSystem: false,
    defaultValue: { name: "''", source: "'MANUAL'" },

    flatRelationTargetFieldMetadata: null,
    flatRelationTargetObjectMetadata: null,
    options: null,
    standardOverrides: null,
    relationTargetFieldMetadataId: null,
    relationTargetObjectMetadataId: null,
    settings: null,
  };

  const positionField: FlatFieldMetadata<FieldMetadataType.POSITION> = {
    type: FieldMetadataType.POSITION,
    id: v4(),
    isLabelSyncedWithName: false,
    isUnique: false,
    objectMetadataId,
    uniqueIdentifier: CUSTOM_OBJECT_STANDARD_FIELD_IDS.position,
    workspaceId,
    standardId: CUSTOM_OBJECT_STANDARD_FIELD_IDS.position,
    name: 'position',
    label: 'Position',
    icon: 'IconHierarchy2',
    description: 'Position',
    isNullable: false,
    isActive: true,
    isCustom: false,
    isSystem: true,
    defaultValue: 0,

    flatRelationTargetFieldMetadata: null,
    flatRelationTargetObjectMetadata: null,
    options: null,
    standardOverrides: null,
    relationTargetFieldMetadataId: null,
    relationTargetObjectMetadataId: null,
    settings: null,
  };

  return {
    idField,
    nameField,
    createdAtField,
    updatedAtField,
    deletedAtField,
    createdByField,
    positionField,
  } as const;
};

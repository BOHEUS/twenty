import { msg } from '@lingui/core/macro';
import {
  CallDirection,
  CallMedium,
  CallStatus,
  DateDisplayFormat,
  FieldMetadataType,
  NumberDataType,
  RelationOnDeleteAction,
  RelationType,
} from 'twenty-shared/types';

import { type FlatFieldMetadata } from 'src/engine/metadata-modules/flat-field-metadata/types/flat-field-metadata.type';
import { type AllStandardObjectFieldName } from 'src/engine/workspace-manager/twenty-standard-application/types/all-standard-object-field-name.type';
import {
  type CreateStandardFieldArgs,
  createStandardFieldFlatMetadata,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/create-standard-field-flat-metadata.util';
import { createStandardRelationFieldFlatMetadata } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/create-standard-relation-field-flat-metadata.util';
import { i18nLabel } from 'src/engine/workspace-manager/twenty-standard-application/utils/i18n-label.util';

export const buildCallStandardFlatFieldMetadatas = ({
  now,
  objectName,
  workspaceId,
  standardObjectMetadataRelatedEntityIds,
  dependencyFlatEntityMaps,
  twentyStandardApplicationId,
}: Omit<CreateStandardFieldArgs<'call', FieldMetadataType>, 'context'>): Record<
  AllStandardObjectFieldName<'call'>,
  FlatFieldMetadata
> => ({
  id: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'id',
      type: FieldMetadataType.UUID,
      label: i18nLabel(msg({ message: `ID`, context: 'fieldMetadata.label' })),
      description: i18nLabel(
        msg({ message: `ID`, context: 'fieldMetadata.description' }),
      ),
      icon: 'Icon123',
      isSystem: true,
      isNullable: false,
      isUIEditable: false,
      defaultValue: 'uuid',
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  createdAt: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'createdAt',
      type: FieldMetadataType.DATE_TIME,
      label: i18nLabel(
        msg({ message: `Creation date`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({ message: `Creation date`, context: 'fieldMetadata.description' }),
      ),
      icon: 'IconCalendar',
      isSystem: true,
      isNullable: false,
      isUIEditable: false,
      defaultValue: 'now',
      settings: { displayFormat: DateDisplayFormat.RELATIVE },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  updatedAt: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'updatedAt',
      type: FieldMetadataType.DATE_TIME,
      label: i18nLabel(
        msg({ message: `Last update`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Last time the record was changed`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconCalendarClock',
      isSystem: true,
      isNullable: false,
      isUIEditable: false,
      defaultValue: 'now',
      settings: { displayFormat: DateDisplayFormat.RELATIVE },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  deletedAt: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'deletedAt',
      type: FieldMetadataType.DATE_TIME,
      label: i18nLabel(
        msg({ message: `Deleted at`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Date when the record was deleted`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconCalendarMinus',
      isSystem: true,
      isNullable: true,
      isUIEditable: false,
      settings: { displayFormat: DateDisplayFormat.RELATIVE },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  createdBy: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'createdBy',
      type: FieldMetadataType.ACTOR,
      label: i18nLabel(
        msg({ message: `Created by`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `The creator of the record`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconCreativeCommonsSa',
      isSystem: true,
      isUIEditable: false,
      isNullable: false,
      defaultValue: {
        source: "'MANUAL'",
        name: "'System'",
        workspaceMemberId: null,
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  updatedBy: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'updatedBy',
      type: FieldMetadataType.ACTOR,
      label: i18nLabel(
        msg({ message: `Updated by`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `The workspace member who last updated the record`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconUserCircle',
      isSystem: true,
      isUIEditable: false,
      isNullable: false,
      defaultValue: {
        source: "'MANUAL'",
        name: "'System'",
        workspaceMemberId: null,
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  position: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'position',
      type: FieldMetadataType.POSITION,
      label: i18nLabel(
        msg({ message: `Position`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Call record position`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconHierarchy2',
      isSystem: true,
      isNullable: false,
      defaultValue: 0,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  searchVector: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'searchVector',
      type: FieldMetadataType.TS_VECTOR,
      label: i18nLabel(
        msg({ message: `Search vector`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Field used for full-text search`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconUser',
      isSystem: true,
      isNullable: true,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  title: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'title',
      type: FieldMetadataType.TEXT,
      label: i18nLabel(
        msg({ message: `Title`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Short description of the call`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconPhone',
      isNullable: true,
      isUIEditable: false,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  direction: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'direction',
      type: FieldMetadataType.SELECT,
      label: i18nLabel(
        msg({ message: `Direction`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Whether the call was placed or received`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconArrowsExchange',
      isNullable: false,
      isUIEditable: false,
      defaultValue: `'${CallDirection.OUTBOUND}'`,
      options: [
        {
          id: '5443e4da-504b-486d-ba10-d92ecb950120',
          value: CallDirection.INBOUND,
          label: i18nLabel(
            msg({ message: `Inbound`, context: 'fieldMetadata.label' }),
          ),
          position: 0,
          color: 'blue',
        },
        {
          id: 'e2bca2e1-ad37-4f48-9992-b7409f8ad31f',
          value: CallDirection.OUTBOUND,
          label: i18nLabel(
            msg({ message: `Outbound`, context: 'fieldMetadata.label' }),
          ),
          position: 1,
          color: 'green',
        },
      ],
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  medium: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'medium',
      type: FieldMetadataType.SELECT,
      label: i18nLabel(
        msg({ message: `Medium`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Channel the call went through`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconDeviceMobile',
      isNullable: false,
      isUIEditable: false,
      defaultValue: `'${CallMedium.PHONE}'`,
      options: [
        {
          id: '60e5fe05-ba6e-4941-a4a3-ba84b5834834',
          value: CallMedium.PHONE,
          label: i18nLabel(
            msg({ message: `Phone`, context: 'fieldMetadata.label' }),
          ),
          position: 0,
          color: 'gray',
        },
        {
          id: '328631dc-6bef-42c3-aed4-5fdb1004b865',
          value: CallMedium.VOIP,
          label: i18nLabel(
            msg({ message: `VoIP`, context: 'fieldMetadata.label' }),
          ),
          position: 1,
          color: 'blue',
        },
        {
          id: 'f549679a-d9c0-47db-927b-e259ef2cfc8f',
          value: CallMedium.WHATSAPP,
          label: i18nLabel(
            msg({ message: `WhatsApp`, context: 'fieldMetadata.label' }),
          ),
          position: 2,
          color: 'green',
        },
        {
          id: '33d3227d-9616-459c-b058-26e609ac8d55',
          value: CallMedium.VIDEO,
          label: i18nLabel(
            msg({ message: `Video`, context: 'fieldMetadata.label' }),
          ),
          position: 3,
          color: 'purple',
        },
      ],
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  status: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'status',
      type: FieldMetadataType.SELECT,
      label: i18nLabel(
        msg({ message: `Status`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Outcome of the call`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconProgress',
      isNullable: false,
      isUIEditable: false,
      defaultValue: `'${CallStatus.COMPLETED}'`,
      options: [
        {
          id: '0aa56b8c-0592-49b0-ae62-2aed99f4b4a9',
          value: CallStatus.RINGING,
          label: i18nLabel(
            msg({ message: `Ringing`, context: 'fieldMetadata.label' }),
          ),
          position: 0,
          color: 'sky',
        },
        {
          id: '9dd8c819-4b5e-4847-a3dc-ca8534b6d15e',
          value: CallStatus.IN_PROGRESS,
          label: i18nLabel(
            msg({ message: `In progress`, context: 'fieldMetadata.label' }),
          ),
          position: 1,
          color: 'blue',
        },
        {
          id: '77272db5-2a9d-4175-bcae-7178f29c37f8',
          value: CallStatus.COMPLETED,
          label: i18nLabel(
            msg({ message: `Completed`, context: 'fieldMetadata.label' }),
          ),
          position: 2,
          color: 'green',
        },
        {
          id: '99771f23-7c27-45c8-8658-24445b86a389',
          value: CallStatus.MISSED,
          label: i18nLabel(
            msg({ message: `Missed`, context: 'fieldMetadata.label' }),
          ),
          position: 3,
          color: 'orange',
        },
        {
          id: 'eac54d18-60c5-479b-99fc-022fa8a3ec06',
          value: CallStatus.VOICEMAIL,
          label: i18nLabel(
            msg({ message: `Voicemail`, context: 'fieldMetadata.label' }),
          ),
          position: 4,
          color: 'yellow',
        },
        {
          id: '14b2b46a-fd15-4439-8674-3010d73b498b',
          value: CallStatus.FAILED,
          label: i18nLabel(
            msg({ message: `Failed`, context: 'fieldMetadata.label' }),
          ),
          position: 5,
          color: 'red',
        },
        {
          id: '618f00d0-4d63-4083-b950-16d9c88984da',
          value: CallStatus.CANCELED,
          label: i18nLabel(
            msg({ message: `Canceled`, context: 'fieldMetadata.label' }),
          ),
          position: 6,
          color: 'gray',
        },
      ],
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  startedAt: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'startedAt',
      type: FieldMetadataType.DATE_TIME,
      label: i18nLabel(
        msg({ message: `Started at`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `When the call started ringing`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconCalendarClock',
      isNullable: true,
      isUIEditable: false,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  answeredAt: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'answeredAt',
      type: FieldMetadataType.DATE_TIME,
      label: i18nLabel(
        msg({ message: `Answered at`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `When the call was picked up`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconPhoneCall',
      isNullable: true,
      isUIEditable: false,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  endedAt: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'endedAt',
      type: FieldMetadataType.DATE_TIME,
      label: i18nLabel(
        msg({ message: `Ended at`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `When the call ended`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconPhoneOff',
      isNullable: true,
      isUIEditable: false,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  durationInSeconds: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'durationInSeconds',
      type: FieldMetadataType.NUMBER,
      label: i18nLabel(
        msg({ message: `Duration`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Talk time in seconds`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconClock',
      isNullable: true,
      isUIEditable: false,
      settings: { dataType: NumberDataType.INT },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  fromPhoneNumber: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'fromPhoneNumber',
      type: FieldMetadataType.TEXT,
      label: i18nLabel(
        msg({ message: `From`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Calling number in E.164 format`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconPhoneOutgoing',
      isNullable: true,
      isUIEditable: false,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  toPhoneNumber: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'toPhoneNumber',
      type: FieldMetadataType.TEXT,
      label: i18nLabel(msg({ message: `To`, context: 'fieldMetadata.label' })),
      description: i18nLabel(
        msg({
          message: `Called number in E.164 format`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconPhoneIncoming',
      isNullable: true,
      isUIEditable: false,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  recordingUrl: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'recordingUrl',
      type: FieldMetadataType.TEXT,
      label: i18nLabel(
        msg({ message: `Recording URL`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Where the provider hosts the recording`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconPlayerPlay',
      isNullable: true,
      isUIEditable: false,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  transcript: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'transcript',
      type: FieldMetadataType.RAW_JSON,
      label: i18nLabel(
        msg({ message: `Transcript`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Normalized diarized transcript`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconFileText',
      isNullable: true,
      isUIEditable: false,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  summary: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'summary',
      type: FieldMetadataType.RICH_TEXT,
      label: i18nLabel(
        msg({ message: `Summary`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Call summary`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconFileText',
      isNullable: true,
      isUIEditable: false,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  applicationId: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'applicationId',
      type: FieldMetadataType.UUID,
      label: i18nLabel(
        msg({ message: `Application ID`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Installed app that created this call`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconApps',
      isNullable: true,
      isUIEditable: false,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  externalCallId: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'externalCallId',
      type: FieldMetadataType.TEXT,
      label: i18nLabel(
        msg({ message: `External Call ID`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Call id on the provider side`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconId',
      isNullable: true,
      isUIEditable: false,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  owner: createStandardRelationFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      type: FieldMetadataType.RELATION,
      morphId: null,
      fieldName: 'owner',
      label: i18nLabel(
        msg({ message: `Owner`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Workspace member who handled the call`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconUserCircle',
      isNullable: true,
      isUIEditable: false,
      targetObjectName: 'workspaceMember',
      targetFieldName: 'ownedCalls',
      settings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: RelationOnDeleteAction.SET_NULL,
        joinColumnName: 'ownerId',
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  company: createStandardRelationFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      type: FieldMetadataType.RELATION,
      morphId: null,
      fieldName: 'company',
      label: i18nLabel(
        msg({ message: `Company`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Company the call is about`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconBuildingSkyscraper',
      isNullable: true,
      isUIEditable: false,
      targetObjectName: 'company',
      targetFieldName: 'calls',
      settings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: RelationOnDeleteAction.SET_NULL,
        joinColumnName: 'companyId',
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  opportunity: createStandardRelationFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      type: FieldMetadataType.RELATION,
      morphId: null,
      fieldName: 'opportunity',
      label: i18nLabel(
        msg({ message: `Opportunity`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Opportunity the call is about`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconTargetArrow',
      isNullable: true,
      isUIEditable: false,
      targetObjectName: 'opportunity',
      targetFieldName: 'calls',
      settings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: RelationOnDeleteAction.SET_NULL,
        joinColumnName: 'opportunityId',
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  participants: createStandardRelationFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      type: FieldMetadataType.RELATION,
      morphId: null,
      fieldName: 'participants',
      label: i18nLabel(
        msg({ message: `Participants`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `People on the call`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconUsers',
      isNullable: true,
      isUIEditable: false,
      targetObjectName: 'callParticipant',
      targetFieldName: 'call',
      settings: {
        relationType: RelationType.ONE_TO_MANY,
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
});

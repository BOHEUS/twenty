import { type FlatViewField } from 'src/engine/metadata-modules/flat-view-field/types/flat-view-field.type';
import {
  createStandardViewFieldFlatMetadata,
  type CreateStandardViewFieldArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field/create-standard-view-field-flat-metadata.util';

export const computeStandardCallParticipantViewFields = (
  args: Omit<CreateStandardViewFieldArgs<'callParticipant'>, 'context'>,
): Record<string, FlatViewField> => {
  return {
    allCallParticipantsHandle: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'callParticipant',
      context: {
        viewName: 'allCallParticipants',
        viewFieldName: 'handle',
        fieldName: 'handle',
        position: 0,
        isVisible: true,
        size: 150,
      },
    }),
    allCallParticipantsCall: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'callParticipant',
      context: {
        viewName: 'allCallParticipants',
        viewFieldName: 'call',
        fieldName: 'call',
        position: 1,
        isVisible: true,
        size: 150,
      },
    }),
    allCallParticipantsRole: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'callParticipant',
      context: {
        viewName: 'allCallParticipants',
        viewFieldName: 'role',
        fieldName: 'role',
        position: 2,
        isVisible: true,
        size: 150,
      },
    }),
    allCallParticipantsDisplayName: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'callParticipant',
      context: {
        viewName: 'allCallParticipants',
        viewFieldName: 'displayName',
        fieldName: 'displayName',
        position: 3,
        isVisible: true,
        size: 150,
      },
    }),
    allCallParticipantsPerson: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'callParticipant',
      context: {
        viewName: 'allCallParticipants',
        viewFieldName: 'person',
        fieldName: 'person',
        position: 4,
        isVisible: true,
        size: 150,
      },
    }),
    allCallParticipantsWorkspaceMember: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'callParticipant',
      context: {
        viewName: 'allCallParticipants',
        viewFieldName: 'workspaceMember',
        fieldName: 'workspaceMember',
        position: 5,
        isVisible: true,
        size: 150,
      },
    }),
    allCallParticipantsCreatedAt: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'callParticipant',
      context: {
        viewName: 'allCallParticipants',
        viewFieldName: 'createdAt',
        fieldName: 'createdAt',
        position: 6,
        isVisible: true,
        size: 150,
      },
    }),
    callParticipantRecordPageFieldsCall: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'callParticipant',
      context: {
        viewName: 'callParticipantRecordPageFields',
        viewFieldName: 'call',
        fieldName: 'call',
        position: 0,
        isVisible: true,
        size: 150,
        viewFieldGroupName: 'general',
      },
    }),
    callParticipantRecordPageFieldsRole: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'callParticipant',
      context: {
        viewName: 'callParticipantRecordPageFields',
        viewFieldName: 'role',
        fieldName: 'role',
        position: 1,
        isVisible: true,
        size: 150,
        viewFieldGroupName: 'general',
      },
    }),
    callParticipantRecordPageFieldsHandle: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'callParticipant',
      context: {
        viewName: 'callParticipantRecordPageFields',
        viewFieldName: 'handle',
        fieldName: 'handle',
        position: 2,
        isVisible: true,
        size: 150,
        viewFieldGroupName: 'general',
      },
    }),
    callParticipantRecordPageFieldsDisplayName:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'callParticipant',
        context: {
          viewName: 'callParticipantRecordPageFields',
          viewFieldName: 'displayName',
          fieldName: 'displayName',
          position: 3,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    callParticipantRecordPageFieldsPerson: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'callParticipant',
      context: {
        viewName: 'callParticipantRecordPageFields',
        viewFieldName: 'person',
        fieldName: 'person',
        position: 4,
        isVisible: true,
        size: 150,
        viewFieldGroupName: 'general',
      },
    }),
    callParticipantRecordPageFieldsWorkspaceMember:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'callParticipant',
        context: {
          viewName: 'callParticipantRecordPageFields',
          viewFieldName: 'workspaceMember',
          fieldName: 'workspaceMember',
          position: 5,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    callParticipantRecordPageFieldsCreatedAt:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'callParticipant',
        context: {
          viewName: 'callParticipantRecordPageFields',
          viewFieldName: 'createdAt',
          fieldName: 'createdAt',
          position: 0,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'system',
        },
      }),
    callParticipantRecordPageFieldsCreatedBy:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'callParticipant',
        context: {
          viewName: 'callParticipantRecordPageFields',
          viewFieldName: 'createdBy',
          fieldName: 'createdBy',
          position: 1,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'system',
        },
      }),
  };
};

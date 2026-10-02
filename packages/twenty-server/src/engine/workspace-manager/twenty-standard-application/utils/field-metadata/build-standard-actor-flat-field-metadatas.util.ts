import { msg } from '@lingui/core/macro';
import { FieldMetadataType } from 'twenty-shared/types';

import { type FlatFieldMetadata } from 'src/engine/metadata-modules/flat-field-metadata/types/flat-field-metadata.type';
import {
  type CreateStandardFieldArgs,
  createStandardFieldFlatMetadata,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/create-standard-field-flat-metadata.util';
import { i18nLabel } from 'src/engine/workspace-manager/twenty-standard-application/utils/i18n-label.util';

type StandardActorObjectName =
  | 'agentChatThread'
  | 'agentChatThreadTarget'
  | 'agentTurn'
  | 'agentMessage'
  | 'agentMessagePart'
  | 'agentTurnEvaluation';

const ACTOR_DEFAULT_VALUE = {
  source: "'MANUAL'",
  name: "'System'",
  workspaceMemberId: null,
};

export const buildStandardActorFlatFieldMetadatas = <
  TObjectName extends StandardActorObjectName,
>(
  args: Omit<
    CreateStandardFieldArgs<TObjectName, FieldMetadataType>,
    'context'
  >,
): Record<'createdBy' | 'updatedBy', FlatFieldMetadata> => ({
  createdBy: createStandardFieldFlatMetadata({
    ...args,
    context: {
      fieldName: 'createdBy',
      type: FieldMetadataType.ACTOR,
      label: i18nLabel(
        msg({ message: 'Created by', context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: 'The creator of the record',
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconCreativeCommonsSa',
      isSystem: true,
      isUIEditable: false,
      isNullable: false,
      defaultValue: ACTOR_DEFAULT_VALUE,
    },
  }),
  updatedBy: createStandardFieldFlatMetadata({
    ...args,
    context: {
      fieldName: 'updatedBy',
      type: FieldMetadataType.ACTOR,
      label: i18nLabel(
        msg({ message: 'Updated by', context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: 'The workspace member who last updated the record',
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconUserCircle',
      isSystem: true,
      isUIEditable: false,
      isNullable: false,
      defaultValue: ACTOR_DEFAULT_VALUE,
    },
  }),
});

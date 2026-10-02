import { type Brand } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';

import { rebrandStandardText } from 'src/engine/core-modules/enterprise/utils/rebrand-standard-text.util';
import { type AgentDTO } from 'src/engine/metadata-modules/ai/ai-agent/dtos/agent.dto';
import { type FlatAgentWithRoleId } from 'src/engine/metadata-modules/flat-agent/types/flat-agent.type';

export const fromFlatAgentWithRoleIdToAgentDto = (
  {
    applicationId,
    createdAt,
    description,
    evaluationInputs,
    icon,
    id,
    isCustom,
    label,
    modelConfiguration,
    modelId,
    name,
    prompt,
    responseFormat,
    updatedAt,
    workspaceId,
    roleId,
  }: FlatAgentWithRoleId,
  brand: Brand,
): AgentDTO => ({
  createdAt: new Date(createdAt),
  description: isDefined(description)
    ? rebrandStandardText({ text: description, brand, isCustom })
    : undefined,
  evaluationInputs,
  id,
  isCustom,
  label,
  modelConfiguration: modelConfiguration ?? undefined,
  modelId,
  name,
  prompt: rebrandStandardText({ text: prompt, brand, isCustom }),
  responseFormat,
  updatedAt: new Date(updatedAt),
  workspaceId,
  applicationId: applicationId ?? undefined,
  icon: icon ?? undefined,
  roleId: roleId ?? undefined,
});

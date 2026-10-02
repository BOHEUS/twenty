import { type Brand } from 'twenty-shared/types';

import { rebrandStandardText } from 'src/engine/core-modules/enterprise/utils/rebrand-standard-text.util';
import { type FlatSkill } from 'src/engine/metadata-modules/flat-skill/types/flat-skill.type';
import { type SkillDTO } from 'src/engine/metadata-modules/skill/dtos/skill.dto';

export const fromFlatSkillToSkillDto = (
  flatSkill: FlatSkill,
  brand: Brand,
): SkillDTO => ({
  id: flatSkill.id,
  name: flatSkill.name,
  label: flatSkill.label,
  icon: flatSkill.icon ?? undefined,
  description: flatSkill.description ?? undefined,
  content: rebrandStandardText({
    text: flatSkill.content,
    brand,
    isCustom: flatSkill.isCustom,
  }),
  isCustom: flatSkill.isCustom,
  isSystem: flatSkill.isSystem,
  isActive: flatSkill.isActive,
  workspaceId: flatSkill.workspaceId,
  applicationId: flatSkill.applicationId ?? undefined,
  createdAt: new Date(flatSkill.createdAt),
  updatedAt: new Date(flatSkill.updatedAt),
});

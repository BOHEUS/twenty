import { z } from 'zod';
import { type Brand } from 'twenty-shared/types';
import { tipTapDocumentToMarkdown } from 'twenty-shared/utils';

import { rebrandStandardText } from 'src/engine/core-modules/enterprise/utils/rebrand-standard-text.util';
import { type FlatSkill } from 'src/engine/metadata-modules/flat-skill/types/flat-skill.type';

export const LOAD_SKILL_TOOL_NAME = 'load_skills';

export const loadSkillInputSchema = z.object({
  skillNames: z
    .array(z.string())
    .describe(
      'Names of the skills to load (e.g., ["workflow-building", "data-manipulation"])',
    ),
});

export type LoadSkillInput = z.infer<typeof loadSkillInputSchema>;

export type LoadSkillResult = {
  skills: Array<{
    name: string;
    label: string;
    content: string;
  }>;
  message: string;
};

export type LoadSkillFunction = (names: string[]) => Promise<FlatSkill[]>;
export type ListAvailableSkillNamesFunction = () => Promise<string[]>;

export const createLoadSkillTool = (
  loadSkills: LoadSkillFunction,
  listAvailableSkillNames: ListAvailableSkillNamesFunction,
  brand: Brand,
) => ({
  description:
    'Load specialized skills for complex tasks. Returns detailed step-by-step instructions for building workflows, dashboards, manipulating data, or managing metadata. Call this before attempting complex operations.',
  inputSchema: loadSkillInputSchema,
  execute: async (parameters: LoadSkillInput): Promise<LoadSkillResult> => {
    const { skillNames } = parameters;

    const skills = await loadSkills(skillNames);

    if (skills.length === 0) {
      const availableNames = await listAvailableSkillNames();

      const availableMessage =
        availableNames.length > 0
          ? `Available skills: ${availableNames.join(', ')}.`
          : 'No skills are currently available in this workspace.';

      return {
        skills: [],
        message: `No skills found with names: ${skillNames.join(', ')}. ${availableMessage}`,
      };
    }

    return {
      skills: skills.map((skill) => ({
        name: skill.name,
        label: skill.label,
        content: rebrandStandardText({
          text: tipTapDocumentToMarkdown(skill.content),
          brand,
          isCustom: skill.isCustom,
        }),
      })),
      message: `Loaded ${skills.map((skill) => skill.label).join(', ')}.`,
    };
  },
});

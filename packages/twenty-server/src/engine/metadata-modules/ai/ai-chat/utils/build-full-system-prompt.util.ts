import { isNonEmptyString } from '@sniptt/guards';
import { isDefined, isNonEmptyArray } from 'twenty-shared/utils';

import { type ToolIndexEntry } from 'src/engine/core-modules/tool-provider/types/tool-index-entry.type';
import { buildToolCatalogSection } from 'src/engine/core-modules/tool-provider/utils/build-tool-catalog-section.util';
import { type UserContext } from 'src/engine/metadata-modules/ai/ai-agent-execution/services/agent-actor-context.service';
import { CHAT_SYSTEM_PROMPTS } from 'src/engine/metadata-modules/ai/ai-chat/constants/chat-system-prompts.const';
import { buildChatBaseSystemPrompt } from 'src/engine/metadata-modules/ai/ai-chat/utils/build-chat-base-system-prompt.util';
import {
  buildReferencedSkillsSection,
  type ReferencedSkill,
} from 'src/engine/metadata-modules/ai/ai-chat/utils/build-referenced-skills-section.util';
import { buildSkillCatalogSection } from 'src/engine/metadata-modules/ai/ai-chat/utils/build-skill-catalog-section.util';
import { buildUploadedFilesSection } from 'src/engine/metadata-modules/ai/ai-chat/utils/build-uploaded-files-section.util';
import { buildUserContextSection } from 'src/engine/metadata-modules/ai/ai-chat/utils/build-user-context-section.util';
import { buildWorkspaceInstructionsSection } from 'src/engine/metadata-modules/ai/ai-chat/utils/build-workspace-instructions-section.util';
import { buildWorkspaceSetupSystemPrompt } from 'src/engine/metadata-modules/ai/ai-chat/utils/build-workspace-setup-system-prompt.util';
import { type UploadedFileReference } from 'src/engine/metadata-modules/ai/ai-chat/types/uploaded-file-reference.type';
import { type FlatSkill } from 'src/engine/metadata-modules/flat-skill/types/flat-skill.type';

export const buildFullSystemPrompt = ({
  toolCatalog,
  skillCatalog,
  referencedSkills = [],
  preloadedTools,
  uploadedFilesContext,
  workspaceInstructions,
  userContext,
  isWorkspaceSetupThread,
  canAttachConversationToRecords,
  brandName,
}: {
  toolCatalog: ToolIndexEntry[];
  skillCatalog: FlatSkill[];
  referencedSkills?: ReferencedSkill[];
  preloadedTools: string[];
  uploadedFilesContext?: {
    uploadedFiles: UploadedFileReference[];
    codeInterpreterFiles: UploadedFileReference[];
  };
  workspaceInstructions?: string;
  userContext?: UserContext;
  isWorkspaceSetupThread?: boolean;
  canAttachConversationToRecords?: boolean;
  brandName: string;
}): string => {
  const parts: string[] = isWorkspaceSetupThread
    ? [
        buildWorkspaceSetupSystemPrompt(brandName),
        CHAT_SYSTEM_PROMPTS.RESPONSE_FORMAT,
      ]
    : [
        buildChatBaseSystemPrompt(brandName),
        CHAT_SYSTEM_PROMPTS.BROWSING_CONTEXT_INSTRUCTION,
        ...(canAttachConversationToRecords
          ? [CHAT_SYSTEM_PROMPTS.CONVERSATION_ATTACHMENT]
          : []),
        CHAT_SYSTEM_PROMPTS.RESPONSE_FORMAT,
      ];

  if (!isWorkspaceSetupThread) {
    const workspaceInstructionsSection = buildWorkspaceInstructionsSection(
      workspaceInstructions ?? '',
    );

    if (isNonEmptyString(workspaceInstructionsSection)) {
      parts.push(workspaceInstructionsSection);
    }
  }

  if (userContext) {
    parts.push(buildUserContextSection(userContext));
  }

  parts.push(buildToolCatalogSection(toolCatalog, preloadedTools));

  const skillSection = buildSkillCatalogSection(skillCatalog);

  if (skillSection) {
    parts.push(skillSection);
  }

  const referencedSkillsSection =
    buildReferencedSkillsSection(referencedSkills);

  if (isNonEmptyString(referencedSkillsSection)) {
    parts.push(referencedSkillsSection);
  }

  if (
    isDefined(uploadedFilesContext) &&
    isNonEmptyArray(uploadedFilesContext.uploadedFiles)
  ) {
    parts.push(buildUploadedFilesSection(uploadedFilesContext));
  }

  return parts.join('\n');
};

// Base system prompt for programmatic agent runs outside workflows (runAgent API, evaluations)
// NOTE: For user-facing chat, use buildChatBaseSystemPrompt from ai-chat/utils

import { TOOL_USAGE_STRATEGY } from 'src/engine/metadata-modules/ai/ai-agent/constants/tool-usage-strategy.const';

export const buildAgentRunBaseSystemPrompt = (brandName: string): string =>
  `You are an AI agent in ${brandName} CRM, invoked programmatically to complete a request.

${TOOL_USAGE_STRATEGY}

Response:
- Your response is returned to the caller and may be shown directly to a person or processed by software
- Answer the request completely and directly
`;

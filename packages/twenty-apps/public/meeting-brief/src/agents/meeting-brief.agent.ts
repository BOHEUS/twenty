import { defineAgent } from 'twenty-sdk/define';

import { MEETING_BRIEF_AGENT_PROMPT } from 'src/constants/meeting-brief-agent-prompt';
import { MEETING_BRIEF_AGENT_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

export default defineAgent({
  universalIdentifier: MEETING_BRIEF_AGENT_UNIVERSAL_IDENTIFIER,
  name: 'meeting-brief',
  label: 'Meeting Brief',
  icon: 'IconLego',
  description:
    'Writes a pre-meeting brief from the CRM records of the people attending, keeping record facts apart from suggestions.',
  prompt: MEETING_BRIEF_AGENT_PROMPT,
  responseFormat: { type: 'text' },
});

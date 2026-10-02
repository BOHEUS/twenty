import { DEFAULT_BRAND } from 'twenty-shared/constants';

import { createLoadSkillTool } from 'src/engine/core-modules/tool-provider/tools/load-skill.tool';
import { type FlatSkill } from 'src/engine/metadata-modules/flat-skill/types/flat-skill.type';

describe('createLoadSkillTool', () => {
  it('projects canonical skill documents to Markdown', async () => {
    const tool = createLoadSkillTool(
      async () => [
        {
          name: 'sales-playbook',
          label: 'Sales playbook',
          content: JSON.stringify({
            type: 'doc',
            attrs: { schemaVersion: 1 },
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'Qualify the account.' }],
              },
            ],
          }),
        } as FlatSkill,
      ],
      async () => [],
      DEFAULT_BRAND,
    );

    await expect(
      tool.execute({ skillNames: ['sales-playbook'] }),
    ).resolves.toMatchObject({
      skills: [
        {
          name: 'sales-playbook',
          label: 'Sales playbook',
          content: 'Qualify the account.',
        },
      ],
    });
  });

  it('rebrands standard skills on a white-labeled instance', async () => {
    const tool = createLoadSkillTool(
      async () => [
        {
          name: 'code-interpreter',
          label: 'Code interpreter',
          isCustom: false,
          content: JSON.stringify({
            type: 'doc',
            attrs: { schemaVersion: 1 },
            content: [
              {
                type: 'paragraph',
                content: [
                  { type: 'text', text: 'Calling Twenty Tools from Python' },
                ],
              },
            ],
          }),
        } as FlatSkill,
      ],
      async () => [],
      { ...DEFAULT_BRAND, isWhiteLabeled: true, name: 'Acme CRM' },
    );

    await expect(
      tool.execute({ skillNames: ['code-interpreter'] }),
    ).resolves.toMatchObject({
      skills: [{ content: 'Calling Acme CRM Tools from Python' }],
    });
  });
});

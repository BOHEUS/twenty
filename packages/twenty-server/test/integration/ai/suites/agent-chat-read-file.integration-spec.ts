import { randomUUID } from 'node:crypto';

import { type LanguageModelV4Prompt } from '@ai-sdk/provider';
import gql from 'graphql-tag';
import {
  answerWith,
  SCRIPTED_MODEL_USAGE,
} from 'test/integration/ai/utils/mock-scripted-ai-model.util';
import { TEST_AI_MODEL_ID } from 'test/integration/constants/test-ai-model-ids.constants';
import { makeMetadataApiRequest } from 'test/integration/metadata/suites/utils/make-metadata-api-request.util';
import { destroyAgentChatThread } from 'test/integration/utils/destroy-agent-chat-thread.util';
import { expectEventually } from 'test/integration/utils/expect-eventually.util';
import { getAppProviderByClassName } from 'test/integration/utils/get-app-provider-by-class-name.util';
import { getCoreRepository } from 'test/integration/utils/get-core-repository.util';
import { createScriptedLanguageModel } from 'test/utils/create-scripted-language-model.util';
import { type ScriptedModelResponse } from 'test/utils/scripted-model-response.type';
import { FileFolder } from 'twenty-shared/types';
import { isNonEmptyArray } from 'twenty-shared/utils';

import { FileEntity } from 'src/engine/core-modules/file/entities/file.entity';
import { type FileUrlService } from 'src/engine/core-modules/file/file-url/file-url.service';
import { FILE_STATUS } from 'src/engine/core-modules/file/types/file-status.type';
import {
  type AiModelRegistryService,
  type RegisteredAiModel,
} from 'src/engine/metadata-modules/ai/ai-models/services/ai-model-registry.service';
import { getWorkspaceSchemaName } from 'src/engine/workspace-datasource/utils/get-workspace-schema-name.util';
import { SEED_APPLE_WORKSPACE_ID } from 'src/engine/workspace-manager/dev-seeder/core/constants/seeder-workspaces.constant';

const schema = getWorkspaceSchemaName(SEED_APPLE_WORKSPACE_ID);
const FILENAME = 'receipt.bin';

const callReadFile = (
  url: string,
  callIndex: number,
): ScriptedModelResponse => ({
  content: [
    {
      type: 'tool-call',
      toolCallId: `read-file-${callIndex}`,
      toolName: 'read_file',
      input: JSON.stringify({ url }),
    },
  ],
  finishReason: { unified: 'tool-calls', raw: undefined },
  usage: SCRIPTED_MODEL_USAGE,
});

const countFileMessages = (prompt: LanguageModelV4Prompt) =>
  prompt.filter(
    (message) =>
      message.role === 'user' &&
      message.content.some(
        (part) =>
          part.type === 'text' && part.text === `Content of ${FILENAME}:`,
      ),
  ).length;

describe('read_file across the steps of a chat turn (integration)', () => {
  const fileId = randomUUID();
  const threadId = randomUUID();

  beforeAll(async () => {
    await getCoreRepository<FileEntity>(FileEntity).insert({
      id: fileId,
      workspaceId: SEED_APPLE_WORKSPACE_ID,
      path: `${FileFolder.FilesField}/${fileId}/${FILENAME}`,
      size: 1,
      mimeType: 'application/octet-stream',
      status: FILE_STATUS.UPLOADED,
    });
  });

  afterAll(async () => {
    await destroyAgentChatThread({ threadId });
    await getCoreRepository<FileEntity>(FileEntity).delete({ id: fileId });
  });

  afterEach(() => jest.restoreAllMocks());

  it('adds the file once and keeps each step prompt as the prefix of the next', async () => {
    const url = await getAppProviderByClassName<FileUrlService>(
      'FileUrlService',
    ).signFileByIdUrl({
      fileId,
      workspaceId: SEED_APPLE_WORKSPACE_ID,
      fileFolder: FileFolder.FilesField,
    });
    const prompts: LanguageModelV4Prompt[] = [];

    const registeredModel: RegisteredAiModel = {
      modelId: TEST_AI_MODEL_ID,
      sdkPackage: '@ai-sdk/openai',
      // thread title generation shares the model but offers no tools
      model: createScriptedLanguageModel((options) => {
        if (!isNonEmptyArray(options.tools)) {
          return answerWith('Receipt');
        }

        prompts.push(options.prompt);

        return prompts.length < 3
          ? callReadFile(url, prompts.length)
          : answerWith('Done');
      }),
    };
    const registry = getAppProviderByClassName<AiModelRegistryService>(
      'AiModelRegistryService',
    );

    jest
      .spyOn(registry, 'getAvailableModels')
      .mockReturnValue([registeredModel]);
    jest
      .spyOn(registry, 'resolveModelForAgent')
      .mockReturnValue(registeredModel);

    const response = await makeMetadataApiRequest({
      query: gql`
        mutation SendChatMessage(
          $threadId: UUID!
          $text: String!
          $messageId: UUID!
        ) {
          sendChatMessage(
            threadId: $threadId
            text: $text
            messageId: $messageId
          ) {
            queued
          }
        }
      `,
      variables: {
        threadId,
        text: 'Read the receipt twice',
        messageId: randomUUID(),
      },
    });

    expect(response.body.errors).toBeUndefined();

    await expectEventually(async () => {
      const [assistantMessage] = await global.testDataSource.query(
        `SELECT id FROM "${schema}"."agentMessage" WHERE "threadId" = $1 AND role = 'assistant'`,
        [threadId],
      );

      expect(assistantMessage).toBeDefined();
    });

    expect(prompts).toHaveLength(3);
    expect(prompts.map(countFileMessages)).toEqual([0, 1, 2]);
    expect(prompts[2].slice(0, prompts[1].length)).toEqual(prompts[1]);
  });
});

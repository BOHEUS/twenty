import { type LanguageModelV4Prompt } from '@ai-sdk/provider';
import { tool } from 'ai';
import { createScriptedLanguageModel } from 'test/utils/create-scripted-language-model.util';
import { type ScriptedModelResponse } from 'test/utils/scripted-model-response.type';
import { z } from 'zod';

import { type ExceptionHandlerService } from 'src/engine/core-modules/exception-handler/exception-handler.service';
import { type MetricsService } from 'src/engine/core-modules/metrics/metrics.service';
import { UsageOperationType } from 'src/engine/core-modules/usage/enums/usage-operation-type.enum';
import { type AgentFilePartService } from 'src/engine/metadata-modules/ai/ai-agent-execution/services/agent-file-part.service';
import { AgentStepLoopService } from 'src/engine/metadata-modules/ai/ai-agent-execution/services/agent-step-loop.service';
import { insertModelInputFileMessages } from 'src/engine/metadata-modules/ai/ai-agent-execution/utils/insert-model-input-file-messages.util';
import { type AiBillingService } from 'src/engine/metadata-modules/ai/ai-billing/services/ai-billing.service';
import { ModelFamily } from 'src/engine/metadata-modules/ai/ai-models/types/model-family.enum';

const USAGE = {
  inputTokens: {
    total: 1,
    noCache: 1,
    cacheRead: undefined,
    cacheWrite: undefined,
  },
  outputTokens: { total: 1, text: 1, reasoning: undefined },
};

const callTool = (toolName: string, toolCallId: string) =>
  ({
    content: [{ type: 'tool-call', toolCallId, toolName, input: '{}' }],
    finishReason: { unified: 'tool-calls', raw: undefined },
    usage: USAGE,
  }) satisfies ScriptedModelResponse;

const answer: ScriptedModelResponse = {
  content: [{ type: 'text', text: 'Done' }],
  finishReason: { unified: 'stop', raw: undefined },
  usage: USAGE,
};

const countFileTextParts = (prompt: LanguageModelV4Prompt) =>
  prompt.flatMap((message) =>
    message.role === 'user'
      ? message.content.filter(
          (part) =>
            part.type === 'text' && part.text === 'Content of receipt.png:',
        )
      : [],
  ).length;

describe('AgentStepLoopService', () => {
  it('inserts a file read by a tool once, keeping earlier steps as the prompt prefix', async () => {
    const prompts: LanguageModelV4Prompt[] = [];
    const scriptedResponses = [
      callTool('read_file', 'read-1'),
      callTool('noop', 'noop-1'),
      answer,
    ];
    const model = createScriptedLanguageModel((options, callIndex) => {
      prompts.push(options.prompt);

      return scriptedResponses[callIndex];
    });

    const agentFilePartService = {
      createFileDelivery: () => ({
        model,
        prepareFileParts: async (messages) =>
          insertModelInputFileMessages(messages),
        downloadFiles: async (requestedFiles) =>
          requestedFiles.map(() => ({
            data: new Uint8Array([1]),
            mediaType: 'image/png',
          })),
      }),
    } as Pick<
      AgentFilePartService,
      'createFileDelivery'
    > as AgentFilePartService;

    const service = new AgentStepLoopService(
      {
        decrementAndCheckAvailableCredits: jest.fn().mockResolvedValue({
          stopReason: null,
          userCreditsUsedMicro: 0,
        }),
        recordStepsUsage: jest.fn().mockResolvedValue(null),
      } as unknown as AiBillingService,
      {
        recordHistogram: jest.fn(),
        incrementCounterBy: jest.fn(),
      } as unknown as MetricsService,
      { captureExceptions: jest.fn() } as unknown as ExceptionHandlerService,
      agentFilePartService,
    );

    const { stream } = service.start({
      registeredModel: {
        model,
        modelId: 'scripted',
        sdkPackage: '@ai-sdk/anthropic',
      },
      modelConfig: {
        sdkPackage: '@ai-sdk/anthropic',
        modelFamily: ModelFamily.CLAUDE,
        modalities: ['image'],
      },
      systemPrompt: 'system',
      messages: [{ role: 'user', content: 'Read the receipt' }],
      tools: {
        read_file: tool({
          inputSchema: z.object({}),
          execute: async () => ({
            modelInputFile: {
              url: 'https://files.example.com/receipt.png',
              filename: 'receipt.png',
              mediaType: 'image/png',
            },
          }),
        }),
        noop: tool({
          inputSchema: z.object({}),
          execute: async () => ({ success: true }),
        }),
      },
      offeredPausingToolNames: [],
      billing: {
        workspaceId: 'workspace-id',
        operationType: UsageOperationType.AI_CHAT_TOKEN,
        webSearchOperationType: UsageOperationType.WEB_SEARCH,
        spenders: {} as Parameters<
          AgentStepLoopService['start']
        >[0]['billing']['spenders'],
      },
      telemetry: { functionId: 'test', isContentRecordingAllowed: false },
      metricsScope: 'chat',
    });

    await stream.consumeStream();

    expect(prompts).toHaveLength(3);
    expect(countFileTextParts(prompts[1])).toBe(1);
    expect(countFileTextParts(prompts[2])).toBe(1);
    expect(prompts[2].slice(0, prompts[1].length)).toEqual(prompts[1]);
  });
});

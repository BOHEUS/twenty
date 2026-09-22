import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { FULLENRICH_API_KEY_VARIABLE } from 'src/constants/application-variables';
import { ENRICH_BATCH_LOGIC_FUNCTION_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

type EnqueueJobsInput = { jobs: { payload: { recordIds: string[] } }[] };

const enqueueJobs = vi.fn(async (input: EnqueueJobsInput) => ({
  enqueued: true,
  logicFunctionUniversalIdentifier:
    ENRICH_BATCH_LOGIC_FUNCTION_UNIVERSAL_IDENTIFIER,
  enqueuedJobsCount: input.jobs.length,
  jobIds: input.jobs.map((_unused, index) => `job-${index}`),
}));

vi.mock('twenty-sdk/logic-function', () => ({ enqueueJobs }));

const { default: enrichLogicFunction } = await import(
  'src/logic-functions/enrich'
);

const callRoute = (recordIds?: string[]) =>
  enrichLogicFunction.config.handler(
    { body: { recordIds } },
    {} as Parameters<typeof enrichLogicFunction.config.handler>[1],
  );

const firstEnqueueInput = (): EnqueueJobsInput =>
  enqueueJobs.mock.calls[0][0];

beforeEach(() => {
  process.env[FULLENRICH_API_KEY_VARIABLE] = 'secret-key';
  process.env.TWENTY_FUNCTIONS_URL = 'https://acme.twenty.com';
  enqueueJobs.mockClear();
});

afterEach(() => {
  delete process.env[FULLENRICH_API_KEY_VARIABLE];
  delete process.env.TWENTY_FUNCTIONS_URL;
});

describe('enrich route', () => {
  it('should enqueue one job per hundred records', async () => {
    const recordIds = Array.from(
      { length: 250 },
      (_unused, index) => `person-${index}`,
    );

    const result = await callRoute(recordIds);

    expect(enqueueJobs).toHaveBeenCalledOnce();
    const { jobs } = firstEnqueueInput();
    expect(jobs).toHaveLength(3);
    expect(jobs[0].payload.recordIds).toHaveLength(100);
    expect(jobs[2].payload.recordIds).toHaveLength(50);
    expect(result).toEqual({ recordCount: 250, enqueuedJobsCount: 3 });
  });

  it('should drop duplicate record ids before batching', async () => {
    await callRoute(['person-1', 'person-1', 'person-2']);

    expect(firstEnqueueInput().jobs[0].payload.recordIds).toEqual([
      'person-1',
      'person-2',
    ]);
  });

  it('should refuse an empty request without enqueuing', async () => {
    expect(await callRoute([])).toHaveProperty('error');
    expect(await callRoute(undefined)).toHaveProperty('error');
    expect(enqueueJobs).not.toHaveBeenCalled();
  });

  it('should answer with the configuration error instead of enqueuing', async () => {
    delete process.env[FULLENRICH_API_KEY_VARIABLE];

    expect(await callRoute(['person-1'])).toHaveProperty(
      'error',
      expect.stringContaining(FULLENRICH_API_KEY_VARIABLE),
    );
    expect(enqueueJobs).not.toHaveBeenCalled();
  });
});

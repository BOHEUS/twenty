import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RetryableLogicFunctionError } from 'twenty-sdk/logic-function';

import { FULLENRICH_API_KEY_VARIABLE } from 'src/constants/application-variables';
import { enrichPeople } from 'src/logic-functions/shared/enrich-people';
import { type TwentyPerson } from 'src/logic-functions/types/twenty.types';

vi.mock('src/logic-functions/data/fetch-records.util', () => ({
  fetchTwentyCompanies: vi.fn(async () => []),
}));

const buildPerson = (overrides: Partial<TwentyPerson> = {}): TwentyPerson =>
  ({
    id: '20202020-0000-4000-8000-000000000001',
    name: { firstName: 'John', lastName: 'Snow' },
    linkedinLink: {
      primaryLinkLabel: '',
      primaryLinkUrl: 'https://www.linkedin.com/in/john-snow',
    },
    companyId: null,
    ...overrides,
  }) as TwentyPerson;

const stubFetch = (status: number, body: object = {}) =>
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => new Response(JSON.stringify(body), { status })),
  );

beforeEach(() => {
  process.env[FULLENRICH_API_KEY_VARIABLE] = 'secret-key';
  process.env.TWENTY_FUNCTIONS_URL = 'https://acme.twenty.com';
  stubFetch(200, { enrichment_id: 'enrichment-id' });
});

afterEach(() => {
  delete process.env[FULLENRICH_API_KEY_VARIABLE];
  delete process.env.TWENTY_FUNCTIONS_URL;
  vi.unstubAllGlobals();
});

describe('enrichPeople', () => {
  it('should send one bulk request for the batch', async () => {
    const result = await enrichPeople({
      people: [buildPerson(), buildPerson({ id: 'person-2' })],
    });

    expect(result).toEqual({
      submitted: 2,
      skipped: 0,
      enrichmentId: 'enrichment-id',
    });
    expect(fetch).toHaveBeenCalledOnce();
  });

  it('should not call FullEnrich when no person can be matched', async () => {
    const result = await enrichPeople({
      people: [
        buildPerson({
          name: { firstName: '', lastName: '' },
          linkedinLink: { primaryLinkLabel: '', primaryLinkUrl: '' },
        }),
      ],
    });

    expect(result).toEqual({ submitted: 0, skipped: 1 });
    expect(fetch).not.toHaveBeenCalled();
  });

  it('should ask the job runner to redeliver when rate limited', async () => {
    stubFetch(429, { code: 'error.rate.limit' });

    await expect(
      enrichPeople({ people: [buildPerson()] }),
    ).rejects.toBeInstanceOf(RetryableLogicFunctionError);
  });

  it('should ask the job runner to redeliver when FullEnrich is down', async () => {
    stubFetch(503);

    await expect(
      enrichPeople({ people: [buildPerson()] }),
    ).rejects.toBeInstanceOf(RetryableLogicFunctionError);
  });

  it('should fail permanently when FullEnrich rejects the request', async () => {
    stubFetch(400, { code: 'error.enrichment.data.empty' });

    const error = await enrichPeople({ people: [buildPerson()] }).catch(
      (thrown: unknown) => thrown,
    );

    expect(error).toBeInstanceOf(Error);
    expect(error).not.toBeInstanceOf(RetryableLogicFunctionError);
  });

  it('should fail permanently when the API key is missing', async () => {
    delete process.env[FULLENRICH_API_KEY_VARIABLE];

    await expect(enrichPeople({ people: [buildPerson()] })).rejects.toThrow(
      FULLENRICH_API_KEY_VARIABLE,
    );
    expect(fetch).not.toHaveBeenCalled();
  });
});

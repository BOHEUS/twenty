import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type MockInstance,
} from 'vitest';

import { lookupPeopleByPhoneNumber } from '@/sdk/logic-function/telephony/lookup-people-by-phone-number';

const graphqlResponse = (body: unknown) =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });

const LOOKUP_RESULT = {
  normalizedPhoneNumber: '+33612345678',
  isTruncated: false,
  candidates: [
    {
      personId: 'p1',
      matchBasis: 'PRIMARY_PHONE',
      matchedPhoneNumber: '+33612345678',
    },
  ],
};

describe('lookupPeopleByPhoneNumber', () => {
  let fetchSpy: MockInstance<typeof fetch>;

  beforeEach(() => {
    process.env.TWENTY_API_URL = 'https://api.test';
    process.env.TWENTY_APP_APPLICATION_ACCESS_TOKEN = 'app-token';
    fetchSpy = vi.spyOn(globalThis, 'fetch');
  });

  afterEach(() => {
    delete process.env.TWENTY_API_URL;
    delete process.env.TWENTY_APP_APPLICATION_ACCESS_TOKEN;
    fetchSpy.mockRestore();
  });

  it('posts the lookup query to the metadata API and returns its result', async () => {
    fetchSpy.mockResolvedValue(
      graphqlResponse({ data: { lookupPeopleByPhoneNumber: LOOKUP_RESULT } }),
    );

    await expect(
      lookupPeopleByPhoneNumber({
        phoneNumber: '06 12 34 56 78',
        defaultCountryCode: 'FR',
      }),
    ).resolves.toEqual(LOOKUP_RESULT);

    expect(fetchSpy).toHaveBeenCalledTimes(1);

    const [url, init] = fetchSpy.mock.calls[0];
    const body = JSON.parse(String(init?.body));

    expect(url).toBe('https://api.test/metadata');
    expect(body.query).toContain('lookupPeopleByPhoneNumber(input: $input)');
    expect(body.variables).toEqual({
      input: { phoneNumber: '06 12 34 56 78', defaultCountryCode: 'FR' },
    });
  });

  it('surfaces graphql errors, such as the feature flag being off', async () => {
    fetchSpy.mockResolvedValue(
      graphqlResponse({ errors: [{ message: 'Forbidden' }] }),
    );

    await expect(
      lookupPeopleByPhoneNumber({ phoneNumber: '+33612345678' }),
    ).rejects.toThrow('lookupPeopleByPhoneNumber() failed: Forbidden');
  });
});

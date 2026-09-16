import { afterEach, describe, expect, it, vi } from 'vitest';

import { fetchApolloPeopleBulk } from 'src/logic-functions/utils/fetch-apollo-people-bulk';

const stubFetch = (response: unknown, status = 200) => {
  const fetchMock = vi.fn((_url: string, _requestInit: RequestInit) =>
    Promise.resolve({
      ok: status < 400,
      status,
      json: () => Promise.resolve(response),
      text: () => Promise.resolve('apollo said no'),
    } as Response),
  );

  vi.stubGlobal('fetch', fetchMock);

  return fetchMock;
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('fetchApolloPeopleBulk', () => {
  it('should send one detail per person and keep Apollo answers in order', async () => {
    const fetchMock = stubFetch({
      matches: [{ id: 'apollo-1' }, null, { id: 'apollo-3' }],
    });

    const result = await fetchApolloPeopleBulk({
      params: [
        { email: 'tim@apollo.io' },
        { firstName: 'Ada', lastName: 'Lovelace', domain: 'apollo.io' },
        { linkedinUrl: 'https://www.linkedin.com/in/someone' },
      ],
      accessToken: 'access-token',
      revealPersonalEmails: true,
    });

    expect(result).toEqual({
      success: true,
      data: [{ id: 'apollo-1' }, undefined, { id: 'apollo-3' }],
    });

    const [url, requestInit] = fetchMock.mock.calls[0];
    expect(url).toBe(
      'https://api.apollo.io/api/v1/people/bulk_match?reveal_personal_emails=true',
    );
    expect(requestInit.headers).toMatchObject({
      authorization: 'Bearer access-token',
    });
    expect(JSON.parse(requestInit.body as string)).toEqual({
      details: [
        { email: 'tim@apollo.io' },
        { first_name: 'Ada', last_name: 'Lovelace', domain: 'apollo.io' },
        { linkedin_url: 'https://www.linkedin.com/in/someone' },
      ],
    });
  });

  it('should surface an Apollo error without blaming the connection', async () => {
    stubFetch({}, 429);

    const result = await fetchApolloPeopleBulk({
      params: [{ email: 'tim@apollo.io' }],
      accessToken: 'access-token',
      revealPersonalEmails: false,
    });

    expect(result).toMatchObject({ success: false, isAuthFailure: false });
  });

  it('should flag a token Apollo rejected', async () => {
    stubFetch({}, 401);

    const result = await fetchApolloPeopleBulk({
      params: [{ email: 'tim@apollo.io' }],
      accessToken: 'stale-token',
      revealPersonalEmails: false,
    });

    expect(result).toMatchObject({ success: false, isAuthFailure: true });
  });
});

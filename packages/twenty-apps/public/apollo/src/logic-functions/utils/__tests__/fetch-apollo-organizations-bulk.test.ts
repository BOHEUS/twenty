import { afterEach, describe, expect, it, vi } from 'vitest';

import { fetchApolloOrganizationsBulk } from 'src/logic-functions/utils/fetch-apollo-organizations-bulk';

const stubFetch = (response: unknown) => {
  const fetchMock = vi.fn((_url: string, _requestInit: RequestInit) =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve(response),
      text: () => Promise.resolve(''),
    } as Response),
  );

  vi.stubGlobal('fetch', fetchMock);

  return fetchMock;
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('fetchApolloOrganizationsBulk', () => {
  it('should return the organization matching each requested domain', async () => {
    const fetchMock = stubFetch({
      organizations: [
        { id: 'org-2', primary_domain: 'stripe.com' },
        { id: 'org-1', website_url: 'https://www.apollo.io' },
      ],
    });

    const result = await fetchApolloOrganizationsBulk({
      domains: ['apollo.io', 'stripe.com'],
      accessToken: 'access-token',
    });

    expect(result).toEqual({
      success: true,
      data: [
        { id: 'org-1', website_url: 'https://www.apollo.io' },
        { id: 'org-2', primary_domain: 'stripe.com' },
      ],
    });

    const [url, requestInit] = fetchMock.mock.calls[0];
    expect(url).toBe(
      'https://api.apollo.io/api/v1/organizations/bulk_enrich?domains%5B%5D=apollo.io&domains%5B%5D=stripe.com',
    );
    expect(requestInit.body).toBeUndefined();
  });

  it('should fall back to the answer position when Apollo returns another domain', async () => {
    stubFetch({ organizations: [{ id: 'org-1', primary_domain: 'meta.com' }] });

    const result = await fetchApolloOrganizationsBulk({
      domains: ['fb.com'],
      accessToken: 'access-token',
    });

    expect(result).toEqual({
      success: true,
      data: [{ id: 'org-1', primary_domain: 'meta.com' }],
    });
  });

  it('should not hand a domain an organization another domain already matched', async () => {
    stubFetch({
      organizations: [
        { id: 'org-2', primary_domain: 'stripe.com' },
        { id: 'org-1', primary_domain: 'apollo.io' },
      ],
    });

    const result = await fetchApolloOrganizationsBulk({
      domains: ['apollo.io', 'fb.com'],
      accessToken: 'access-token',
    });

    expect(result).toEqual({
      success: true,
      data: [{ id: 'org-1', primary_domain: 'apollo.io' }, undefined],
    });
  });

  it('should report a domain Apollo did not answer for', async () => {
    stubFetch({
      organizations: [{ id: 'org-1', primary_domain: 'apollo.io' }],
    });

    const result = await fetchApolloOrganizationsBulk({
      domains: ['apollo.io', 'unknown.io'],
      accessToken: 'access-token',
    });

    expect(result).toEqual({
      success: true,
      data: [{ id: 'org-1', primary_domain: 'apollo.io' }, undefined],
    });
  });
});

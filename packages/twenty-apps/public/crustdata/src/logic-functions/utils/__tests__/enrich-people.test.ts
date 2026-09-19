import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { enrichPeople } from 'src/logic-functions/utils/enrich-people';

const PROFILE_URL = 'https://www.linkedin.com/in/adalovelace';

const jsonResponse = ({
  body,
  status = 200,
  creditsUsed = '0',
}: {
  body: unknown;
  status?: number;
  creditsUsed?: string;
}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'x-credits-used': creditsUsed },
  });

const profileBody = [
  {
    matched_on: PROFILE_URL,
    match_status: 'matched',
    matches: [
      {
        confidence_score: 1,
        person_data: {
          crustdata_person_id: 78123,
          basic_profile: { first_name: 'Ada', last_name: 'Lovelace' },
        },
      },
    ],
  },
];

const BUSINESS_EMAIL = 'grace@analyticalengines.com';

const contactBody = [
  {
    matched_on: PROFILE_URL,
    match_status: 'matched',
    matches: [
      {
        confidence_score: 1,
        person_data: {
          crustdata_person_id: 78123,
          contact: {
            business_emails: [
              { email: 'ada@analyticalengines.com', status: 'deliverable' },
            ],
          },
        },
      },
    ],
  },
];

beforeEach(() => {
  process.env.CRUSTDATA_API_KEY = 'test-key';
});

afterEach(() => {
  vi.unstubAllGlobals();
  delete process.env.CRUSTDATA_API_KEY;
});

describe('enrichPeople', () => {
  it('sends the profile URL and the requested field sections', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(jsonResponse({ body: profileBody, creditsUsed: '2' }));
    vi.stubGlobal('fetch', fetchMock);

    const { results, creditsUsed } = await enrichPeople([
      { matchOn: 'profileUrl', profileUrl: PROFILE_URL, enrichContactData: false },
    ]);

    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://api.crustdata.com/person/enrich');
    expect(init.headers['x-api-version']).toBe('2025-11-01');
    expect(init.headers.Authorization).toBe('Bearer test-key');

    const body = JSON.parse(init.body);
    expect(body.professional_network_profile_urls).toEqual([PROFILE_URL]);
    expect(body.fields).toContain('experience');

    expect(results[0]).toMatchObject({ outcome: 'matched' });
    expect(creditsUsed).toBe(2);
  });

  it('merges contact data in and bills both calls when contact enrichment is on', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        jsonResponse({ body: profileBody, creditsUsed: '2' }),
      )
      .mockResolvedValueOnce(
        jsonResponse({ body: contactBody, creditsUsed: '5' }),
      );
    vi.stubGlobal('fetch', fetchMock);

    const { results, creditsUsed } = await enrichPeople([
      { matchOn: 'profileUrl', profileUrl: PROFILE_URL, enrichContactData: true },
    ]);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[1][0]).toBe(
      'https://api.crustdata.com/person/contact/enrich',
    );

    const matched = results[0];
    expect(matched.outcome).toBe('matched');
    expect(
      matched.outcome === 'matched'
        ? matched.data.contact?.business_emails?.[0]?.email
        : undefined,
    ).toBe('ada@analyticalengines.com');
    expect(creditsUsed).toBe(7);
  });

  it('keeps the profile data when contact enrichment is denied by the plan', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        jsonResponse({ body: profileBody, creditsUsed: '2' }),
      )
      .mockResolvedValueOnce(
        jsonResponse({
          body: { error: { message: 'Access denied to endpoint' } },
          status: 403,
        }),
      );
    vi.stubGlobal('fetch', fetchMock);

    const { results } = await enrichPeople([
      { matchOn: 'profileUrl', profileUrl: PROFILE_URL, enrichContactData: true },
    ]);

    expect(results[0]).toMatchObject({ outcome: 'matched' });
  });

  it('turns a failed profile call into an error for every record', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        jsonResponse({
          body: { error: { message: 'Invalid API key in request.' } },
          status: 401,
        }),
      ),
    );

    const { results } = await enrichPeople([
      { matchOn: 'profileUrl', profileUrl: PROFILE_URL, enrichContactData: false },
    ]);

    expect(results[0]).toMatchObject({
      outcome: 'error',
      httpStatus: 401,
      message: 'Invalid API key in request. (HTTP 401)',
    });
  });

  it('enriches contact data by business email when there is no profile URL', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({
        body: [
          {
            matched_on: BUSINESS_EMAIL,
            match_status: 'matched',
            matches: [
              {
                confidence_score: 1,
                person_data: {
                  crustdata_person_id: 9,
                  contact: {
                    phone_numbers: ['+442071234567'],
                  },
                },
              },
            ],
          },
        ],
        creditsUsed: '5',
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const { results, creditsUsed } = await enrichPeople([
      { matchOn: 'businessEmail', businessEmail: BUSINESS_EMAIL },
    ]);

    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://api.crustdata.com/person/contact/enrich');
    expect(JSON.parse(init.body).business_emails).toEqual([BUSINESS_EMAIL]);

    expect(results[0]).toMatchObject({ outcome: 'matched' });
    expect(creditsUsed).toBe(5);
  });

  it('reports an unmatched business email as not found', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        jsonResponse({
          body: [{ matched_on: BUSINESS_EMAIL, match_status: 'not_found', matches: [] }],
        }),
      ),
    );

    const { results } = await enrichPeople([
      { matchOn: 'businessEmail', businessEmail: BUSINESS_EMAIL },
    ]);

    expect(results[0]).toMatchObject({ outcome: 'not_found' });
  });

  it('does not call the profile endpoint when every record is email-only', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(jsonResponse({ body: [], creditsUsed: '0' }));
    vi.stubGlobal('fetch', fetchMock);

    await enrichPeople([
      { matchOn: 'businessEmail', businessEmail: BUSINESS_EMAIL },
    ]);

    expect(
      fetchMock.mock.calls.map(([url]) => url),
    ).not.toContain('https://api.crustdata.com/person/enrich');
  });
});

import { describe, expect, it } from 'vitest';

import { parsePersonLookupResponse } from 'src/logic-functions/utils/parse-person-lookup-response';

describe('parsePersonLookupResponse', () => {
  it('matches a completed lookup', () => {
    expect(
      parsePersonLookupResponse({
        json: { id: 1, status: 'complete', name: 'Ada Lovelace' },
        httpStatus: 200,
      }),
    ).toEqual({
      outcome: 'matched',
      httpStatus: 200,
      data: { id: 1, status: 'complete', name: 'Ada Lovelace' },
    });
  });

  it('keeps an unfinished lookup pending with its profile id', () => {
    const result = parsePersonLookupResponse({
      json: { id: 42, status: 'progress' },
      httpStatus: 200,
    });

    expect(result.outcome).toBe('pending');
    expect(result).toMatchObject({ profileId: 42 });
  });

  it('treats searching and not queued as pending too', () => {
    expect(
      parsePersonLookupResponse({
        json: { id: 42, status: 'searching' },
        httpStatus: 200,
      }).outcome,
    ).toBe('pending');
    expect(
      parsePersonLookupResponse({
        json: { id: 42, status: 'not queued' },
        httpStatus: 200,
      }).outcome,
    ).toBe('pending');
  });

  it('maps 404 to not found', () => {
    expect(
      parsePersonLookupResponse({ json: {}, httpStatus: 404 }),
    ).toEqual({ outcome: 'not_found', httpStatus: 404 });
  });

  it('surfaces the API error message on failure', () => {
    expect(
      parsePersonLookupResponse({
        json: { detail: 'Invalid API key' },
        httpStatus: 401,
      }),
    ).toEqual({
      outcome: 'error',
      httpStatus: 401,
      message: 'Invalid API key',
    });
  });
});

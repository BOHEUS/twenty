import { vi } from 'vitest';

export type SnovFetchCall = {
  url: string;
  method: string;
  authorization?: string;
  body?: string;
};

export const jsonResponse = (status: number, json: unknown) =>
  new Response(JSON.stringify(json), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export const stubSnovFetch = (respond: (call: SnovFetchCall) => Response) => {
  const calls: SnovFetchCall[] = [];
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string, init: RequestInit) => {
      const headers = (init.headers ?? {}) as Record<string, string>;
      const call = {
        url,
        method: init.method ?? 'GET',
        authorization: headers.Authorization,
        body: init.body === undefined ? undefined : String(init.body),
      };
      calls.push(call);

      if (url.endsWith('/v1/oauth/access_token')) {
        return jsonResponse(200, {
          access_token: 'token-1',
          token_type: 'Bearer',
          expires_in: 3600,
        });
      }

      return respond(call);
    }),
  );

  return calls;
};

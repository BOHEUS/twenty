import { vi } from 'vitest';

export type AmplemarketFetchCall = { url: URL; authorization?: string };

export const jsonResponse = (status: number, json: unknown) =>
  new Response(JSON.stringify(json), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export const errorResponse = (status: number, code: string, detail: string) =>
  jsonResponse(status, {
    object: 'error',
    _errors: [{ code, title: code, detail }],
  });

export const stubAmplemarketFetch = (
  respond: (call: AmplemarketFetchCall) => Response,
) => {
  const calls: AmplemarketFetchCall[] = [];
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string, init: RequestInit) => {
      const call = {
        url: new URL(url),
        authorization: (init.headers as Record<string, string>).Authorization,
      };
      calls.push(call);

      return respond(call);
    }),
  );

  return calls;
};

import { vi } from 'vitest';

export type HunterFetchCall = { url: URL; apiKey?: string };

export const jsonResponse = (status: number, json: unknown) =>
  new Response(JSON.stringify(json), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export const stubHunterFetch = (
  respond: (call: HunterFetchCall) => Response,
) => {
  const calls: HunterFetchCall[] = [];
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string, init: RequestInit) => {
      const call = {
        url: new URL(url),
        apiKey: (init.headers as Record<string, string>)['X-API-KEY'],
      };
      calls.push(call);

      return respond(call);
    }),
  );

  return calls;
};

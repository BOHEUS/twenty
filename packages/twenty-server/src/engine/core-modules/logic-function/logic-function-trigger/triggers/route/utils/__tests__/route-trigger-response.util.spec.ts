import { type Response } from 'express';

import {
  ALLOWED_RESPONSE_HEADERS,
  sendRouteTriggerResponse,
} from 'src/engine/core-modules/logic-function/logic-function-trigger/triggers/route/utils/route-trigger-response.util';

const createMockResponse = () => {
  const headers: Record<string, string> = {};

  const response = {
    status: jest.fn().mockReturnThis(),
    setHeader: jest.fn((key: string, value: string) => {
      headers[key.toLowerCase()] = value;
    }),
    getHeader: jest.fn((key: string) => headers[key.toLowerCase()]),
    send: jest.fn(),
    json: jest.fn(),
  } as unknown as Response;

  return { response, headers };
};

describe('sendRouteTriggerResponse', () => {
  it('forwards the webhook handshake validation token', () => {
    const { response, headers } = createMockResponse();

    sendRouteTriggerResponse(response, {
      statusCode: 200,
      headers: { 'Validation-Token': 'abc123' },
      body: undefined,
    });

    expect(headers['validation-token']).toBe('abc123');
    expect(response.send).toHaveBeenCalledWith();
  });

  it('drops headers outside the allowlist', () => {
    const { response, headers } = createMockResponse();

    sendRouteTriggerResponse(response, {
      statusCode: 200,
      headers: {
        'Set-Cookie': 'session=1',
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/plain',
      },
      body: 'ok',
    });

    expect(headers).toEqual({ 'content-type': 'text/plain' });
    expect(response.send).toHaveBeenCalledWith('ok');
  });

  it('forwards every header on isolated origins', () => {
    const { response, headers } = createMockResponse();

    sendRouteTriggerResponse(
      response,
      {
        statusCode: 204,
        headers: { 'X-Anything': 'yes' },
        body: undefined,
      },
      { allowAllHeaders: true },
    );

    expect(headers['x-anything']).toBe('yes');
    expect(response.status).toHaveBeenCalledWith(204);
  });

  it('keeps the allowlist free of credential-bearing headers', () => {
    expect(ALLOWED_RESPONSE_HEADERS.has('set-cookie')).toBe(false);
    expect(ALLOWED_RESPONSE_HEADERS.has('authorization')).toBe(false);
  });
});

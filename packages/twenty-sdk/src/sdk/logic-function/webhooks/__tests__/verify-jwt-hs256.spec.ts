import { createHmac } from 'node:crypto';

import { verifyJwtHs256 } from '@/sdk/logic-function/webhooks/verify-jwt-hs256';

const SECRET = 'dialpad-shared-secret';
const NOW = new Date('2026-10-04T12:00:00Z');
const NOW_SECONDS = Math.floor(NOW.getTime() / 1000);

const base64Url = (value: object) =>
  Buffer.from(JSON.stringify(value)).toString('base64url');

const buildToken = ({
  header = { alg: 'HS256', typ: 'JWT' },
  payload,
  secret = SECRET,
}: {
  header?: object;
  payload: object;
  secret?: string;
}) => {
  const signingInput = `${base64Url(header)}.${base64Url(payload)}`;
  const signature = createHmac('sha256', secret)
    .update(signingInput)
    .digest('base64url');

  return `${signingInput}.${signature}`;
};

describe('verifyJwtHs256', () => {
  it('accepts a correctly signed token and returns its payload', () => {
    const token = buildToken({
      payload: { call_id: 'c1', state: 'hangup', exp: NOW_SECONDS + 300 },
    });

    expect(verifyJwtHs256({ token, secret: SECRET, now: NOW })).toEqual({
      valid: true,
      payload: { call_id: 'c1', state: 'hangup', exp: NOW_SECONDS + 300 },
    });
  });

  it('accepts a token without exp or nbf', () => {
    const token = buildToken({ payload: { call_id: 'c1' } });

    expect(verifyJwtHs256({ token, secret: SECRET, now: NOW }).valid).toBe(
      true,
    );
  });

  it('rejects an empty secret even when the token was signed with it', () => {
    const token = buildToken({ payload: { call_id: 'c1' }, secret: '' });

    expect(verifyJwtHs256({ token, secret: '', now: NOW })).toEqual({
      valid: false,
      error: 'Missing secret',
    });
  });

  it('rejects an invalid verification time instead of skipping exp checks', () => {
    const token = buildToken({ payload: { exp: NOW_SECONDS - 3600 } });

    expect(
      verifyJwtHs256({ token, secret: SECRET, now: new Date('invalid') }),
    ).toEqual({ valid: false, error: 'Invalid verification time' });
  });

  it('rejects a token signed with another secret', () => {
    const token = buildToken({ payload: { call_id: 'c1' }, secret: 'other' });

    expect(verifyJwtHs256({ token, secret: SECRET, now: NOW })).toEqual({
      valid: false,
      error: 'Signature verification failed',
    });
  });

  it('rejects a tampered payload', () => {
    const token = buildToken({ payload: { call_id: 'c1' } });
    const [header, , signature] = token.split('.');
    const tampered = `${header}.${base64Url({ call_id: 'c2' })}.${signature}`;

    expect(
      verifyJwtHs256({ token: tampered, secret: SECRET, now: NOW }),
    ).toEqual({ valid: false, error: 'Signature verification failed' });
  });

  it('rejects the none algorithm even with an empty signature', () => {
    const header = base64Url({ alg: 'none', typ: 'JWT' });
    const token = `${header}.${base64Url({ call_id: 'c1' })}.`;

    expect(verifyJwtHs256({ token, secret: SECRET, now: NOW })).toEqual({
      valid: false,
      error: 'Token algorithm must be HS256',
    });
  });

  it('rejects other HMAC algorithms', () => {
    const token = buildToken({
      header: { alg: 'HS512', typ: 'JWT' },
      payload: { call_id: 'c1' },
    });

    expect(verifyJwtHs256({ token, secret: SECRET, now: NOW }).valid).toBe(
      false,
    );
  });

  it('rejects an expired token beyond the clock tolerance', () => {
    const token = buildToken({ payload: { exp: NOW_SECONDS - 120 } });

    expect(verifyJwtHs256({ token, secret: SECRET, now: NOW })).toEqual({
      valid: false,
      error: 'Token has expired',
    });
  });

  it('accepts a token that expired within the clock tolerance', () => {
    const token = buildToken({ payload: { exp: NOW_SECONDS - 30 } });

    expect(verifyJwtHs256({ token, secret: SECRET, now: NOW }).valid).toBe(
      true,
    );
  });

  it('rejects a token that is not valid yet', () => {
    const token = buildToken({ payload: { nbf: NOW_SECONDS + 600 } });

    expect(verifyJwtHs256({ token, secret: SECRET, now: NOW })).toEqual({
      valid: false,
      error: 'Token is not valid yet',
    });
  });

  it.each([
    [null, 'Missing token'],
    ['', 'Missing token'],
    ['a.b', 'Token must have three segments'],
    ['a.b.c.d', 'Token must have three segments'],
    ['!!!.b.c', 'Token header is not valid JSON'],
  ])('rejects malformed token %p', (token, error) => {
    expect(verifyJwtHs256({ token, secret: SECRET, now: NOW })).toEqual({
      valid: false,
      error,
    });
  });

  it('rejects a signed token whose payload is not JSON', () => {
    const header = base64Url({ alg: 'HS256' });
    const payload = Buffer.from('not json').toString('base64url');
    const signature = createHmac('sha256', SECRET)
      .update(`${header}.${payload}`)
      .digest('base64url');

    expect(
      verifyJwtHs256({
        token: `${header}.${payload}.${signature}`,
        secret: SECRET,
        now: NOW,
      }),
    ).toEqual({ valid: false, error: 'Token payload is not valid JSON' });
  });
});

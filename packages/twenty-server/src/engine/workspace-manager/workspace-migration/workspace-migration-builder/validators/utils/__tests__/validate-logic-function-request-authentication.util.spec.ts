import { type ServerRouteTriggerSettings } from 'twenty-shared/application';

import { validateLogicFunctionRequestAuthentication } from 'src/engine/workspace-manager/workspace-migration/workspace-migration-builder/validators/utils/validate-logic-function-request-authentication.util';

const withAuthentication = (requestAuthentication: unknown) =>
  ({
    forwardedRequestHeaders: [],
    requestAuthentication,
  }) as ServerRouteTriggerSettings;

describe('validateLogicFunctionRequestAuthentication', () => {
  it('accepts settings without request authentication', () => {
    expect(validateLogicFunctionRequestAuthentication({})).toEqual([]);
    expect(
      validateLogicFunctionRequestAuthentication({
        serverRouteTriggerSettings: { forwardedRequestHeaders: [] },
      }),
    ).toEqual([]);
  });

  it.each([
    {
      type: 'HMAC_SIGNATURE',
      headerName: 'X-Signature',
      secretServerVariableName: 'SECRET',
      algorithm: 'sha1',
      encoding: 'base64',
      signaturePrefix: 'v1=',
    },
    {
      type: 'HEADER_TOKEN',
      headerName: 'Authorization',
      secretServerVariableName: 'SECRET',
      tokenPrefix: 'Bearer ',
    },
    {
      type: 'QUERY_TOKEN',
      parameterName: 'token',
      secretServerVariableName: 'SECRET',
    },
  ])('accepts a well-formed %o', (requestAuthentication) => {
    expect(
      validateLogicFunctionRequestAuthentication({
        serverRouteTriggerSettings: withAuthentication(requestAuthentication),
      }),
    ).toEqual([]);
  });

  it.each([
    [{ type: 'HMAC_SIGNATURE', headerName: 'X' }, 'secretServerVariableName'],
    [
      { type: 'HMAC_SIGNATURE', secretServerVariableName: 'S' },
      'headerName is required',
    ],
    [
      {
        type: 'HMAC_SIGNATURE',
        headerName: 'X',
        secretServerVariableName: 'S',
        algorithm: 'md5',
      },
      'algorithm',
    ],
    [
      {
        type: 'HMAC_SIGNATURE',
        headerName: 'X',
        secretServerVariableName: 'S',
        encoding: 'utf8',
      },
      'encoding',
    ],
    [
      { type: 'HEADER_TOKEN', secretServerVariableName: 'S' },
      'headerName is required',
    ],
    [
      { type: 'QUERY_TOKEN', secretServerVariableName: 'S' },
      'parameterName is required',
    ],
    [{ type: 'BASIC', secretServerVariableName: 'S' }, 'type must be'],
    ['not-an-object', 'must be an object'],
  ])('rejects %o', (requestAuthentication, expectedMessagePart) => {
    const errors = validateLogicFunctionRequestAuthentication({
      serverRouteTriggerSettings: withAuthentication(requestAuthentication),
    });

    expect(errors.length).toBeGreaterThan(0);
    expect(
      errors.some((error) => error.message.includes(expectedMessagePart)),
    ).toBe(true);
  });
});

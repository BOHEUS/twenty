import { type StoredOAuthConnectionProviderConfig } from 'twenty-shared/application';

import { validateConnectionProviderTypeConfig } from 'src/engine/workspace-manager/workspace-migration/workspace-migration-builder/validators/utils/validate-connection-provider-type-config.util';

const OAUTH_CONFIG: StoredOAuthConnectionProviderConfig = {
  authorizationEndpoint: 'https://example.com/oauth/authorize',
  tokenEndpoint: 'https://example.com/oauth/token',
  revokeEndpoint: null,
  scopes: [],
  clientIdVariable: 'EXAMPLE_CLIENT_ID',
  clientSecretVariable: 'EXAMPLE_CLIENT_SECRET',
  authorizationParams: null,
  tokenRequestContentType: 'json',
  usePkce: true,
};

const IDENTIFY_ACCOUNT_UNIVERSAL_IDENTIFIER =
  'b648f87b-1d26-4961-b974-0908fd991061';

describe('validateConnectionProviderTypeConfig', () => {
  it('should accept an oauth provider with a complete oauthConfig', () => {
    expect(
      validateConnectionProviderTypeConfig({
        type: 'oauth',
        oauthConfig: OAUTH_CONFIG,
        identifyAccountLogicFunctionUniversalIdentifier: null,
      }),
    ).toEqual([]);
  });

  it('should reject an oauth provider without oauthConfig', () => {
    const errors = validateConnectionProviderTypeConfig({
      type: 'oauth',
      oauthConfig: null,
      identifyAccountLogicFunctionUniversalIdentifier: null,
    });

    expect(errors).toHaveLength(1);
    expect(errors[0]?.message).toContain('missing oauthConfig');
  });

  it('should report each missing required oauth field', () => {
    const errors = validateConnectionProviderTypeConfig({
      type: 'oauth',
      oauthConfig: { ...OAUTH_CONFIG, tokenEndpoint: '', clientIdVariable: '' },
      identifyAccountLogicFunctionUniversalIdentifier: null,
    });

    expect(errors.map((error) => error.message)).toEqual([
      'Connection provider oauthConfig.tokenEndpoint is required',
      'Connection provider oauthConfig.clientIdVariable is required',
    ]);
  });

  it('should accept an apiKey provider with an identifyAccount logic function', () => {
    expect(
      validateConnectionProviderTypeConfig({
        type: 'apiKey',
        oauthConfig: null,
        identifyAccountLogicFunctionUniversalIdentifier:
          IDENTIFY_ACCOUNT_UNIVERSAL_IDENTIFIER,
      }),
    ).toEqual([]);
  });

  it('should reject an apiKey provider without an identifyAccount logic function', () => {
    const errors = validateConnectionProviderTypeConfig({
      type: 'apiKey',
      oauthConfig: null,
      identifyAccountLogicFunctionUniversalIdentifier: null,
    });

    expect(errors).toHaveLength(1);
    expect(errors[0]?.message).toContain('identifyAccount');
  });

  it('should reject an apiKey provider with an oauthConfig', () => {
    const errors = validateConnectionProviderTypeConfig({
      type: 'apiKey',
      oauthConfig: OAUTH_CONFIG,
      identifyAccountLogicFunctionUniversalIdentifier:
        IDENTIFY_ACCOUNT_UNIVERSAL_IDENTIFIER,
    });

    expect(errors).toHaveLength(1);
    expect(errors[0]?.message).toContain('must not have an oauthConfig');
  });

  it('should reject an unknown type', () => {
    const errors = validateConnectionProviderTypeConfig({
      type: 'basicAuth' as never,
      oauthConfig: null,
      identifyAccountLogicFunctionUniversalIdentifier: null,
    });

    expect(errors).toHaveLength(1);
    expect(errors[0]?.message).toContain('basicAuth');
  });
});

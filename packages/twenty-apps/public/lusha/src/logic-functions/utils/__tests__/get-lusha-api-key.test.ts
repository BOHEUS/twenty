import { afterEach, describe, expect, it, vi } from 'vitest';

import { getLushaApiKey } from 'src/logic-functions/utils/get-lusha-api-key';

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('getLushaApiKey', () => {
  it('should prefer the key of the workspace over the key of the instance', () => {
    vi.stubEnv('LUSHA_API_KEY', 'workspace-api-key');
    vi.stubEnv('LUSHA_DEFAULT_API_KEY', 'instance-api-key');

    expect(getLushaApiKey()).toEqual({
      value: 'workspace-api-key',
      isBillable: false,
    });
  });

  it('should fall back to the key of the instance', () => {
    vi.stubEnv('LUSHA_API_KEY', '  ');
    vi.stubEnv('LUSHA_DEFAULT_API_KEY', 'instance-api-key');

    expect(getLushaApiKey()).toEqual({
      value: 'instance-api-key',
      isBillable: true,
    });
  });

  it('should return nothing when neither key is set', () => {
    vi.stubEnv('LUSHA_API_KEY', '');
    vi.stubEnv('LUSHA_DEFAULT_API_KEY', '');

    expect(getLushaApiKey()).toBeUndefined();
  });
});

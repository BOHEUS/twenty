import { afterEach, describe, expect, it } from 'vitest';

import {
  REVEAL_PERSONAL_EMAIL_VARIABLE_NAME,
  REVEAL_PHONE_VARIABLE_NAME,
} from 'src/constants/server-variable-names';
import { resolveRevealSettings } from 'src/logic-functions/utils/resolve-reveal-settings';

afterEach(() => {
  delete process.env[REVEAL_PERSONAL_EMAIL_VARIABLE_NAME];
  delete process.env[REVEAL_PHONE_VARIABLE_NAME];
});

describe('resolveRevealSettings', () => {
  it('always asks for a professional email and detailed enrichment', () => {
    const revealSettings = resolveRevealSettings({});

    expect(revealSettings.professionalEmail).toBe(true);
    expect(revealSettings.detailedPersonEnrichment).toBe(true);
  });

  it('keeps the costly reveals off by default', () => {
    const revealSettings = resolveRevealSettings({});

    expect(revealSettings.personalEmail).toBe(false);
    expect(revealSettings.phone).toBe(false);
  });

  it('falls back to the server variables', () => {
    process.env[REVEAL_PHONE_VARIABLE_NAME] = 'true';

    expect(resolveRevealSettings({}).phone).toBe(true);
  });

  it('lets the caller override the server variable', () => {
    process.env[REVEAL_PHONE_VARIABLE_NAME] = 'true';

    expect(resolveRevealSettings({ revealPhone: false }).phone).toBe(false);
  });
});

import { afterEach, describe, expect, it, vi } from 'vitest';

import { resolveContactTypes } from 'src/logic-functions/utils/resolve-contact-types';

describe('resolveContactTypes', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('defaults to the professional email when the variable is absent', () => {
    vi.stubEnv('EXPLORIUM_CONTACT_DETAILS', undefined);

    expect(resolveContactTypes()).toEqual(['email']);
  });

  it('reads the selected contact details', () => {
    vi.stubEnv('EXPLORIUM_CONTACT_DETAILS', '["phone","email"]');

    expect(resolveContactTypes()).toEqual(['phone', 'email']);
  });

  it('returns nothing when the selection was emptied', () => {
    vi.stubEnv('EXPLORIUM_CONTACT_DETAILS', '');

    expect(resolveContactTypes()).toEqual([]);
  });

  it('drops unknown and duplicate values', () => {
    vi.stubEnv('EXPLORIUM_CONTACT_DETAILS', '["email","fax","email"]');

    expect(resolveContactTypes()).toEqual(['email']);
  });

  it('falls back to the default on a malformed value', () => {
    vi.stubEnv('EXPLORIUM_CONTACT_DETAILS', 'not json');

    expect(resolveContactTypes()).toEqual(['email']);
  });
});

import { afterEach, describe, expect, it, vi } from 'vitest';

import { resolveContactTypes } from 'src/logic-functions/utils/resolve-contact-types';

describe('resolveContactTypes', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('defaults to revealing emails only', () => {
    vi.stubEnv('AMPLEMARKET_CONTACT_DETAILS', undefined);

    expect(resolveContactTypes()).toEqual(['email']);
  });

  it('reads the selection and drops unknown values', () => {
    vi.stubEnv('AMPLEMARKET_CONTACT_DETAILS', '["phone","fax"]');

    expect(resolveContactTypes()).toEqual(['phone']);
  });

  it('reveals nothing when the selection was emptied', () => {
    vi.stubEnv('AMPLEMARKET_CONTACT_DETAILS', '');

    expect(resolveContactTypes()).toEqual([]);
  });
});

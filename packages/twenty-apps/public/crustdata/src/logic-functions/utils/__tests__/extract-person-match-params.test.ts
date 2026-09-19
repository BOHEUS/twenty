import { afterEach, describe, expect, it } from 'vitest';

import { extractPersonMatchParams } from 'src/logic-functions/utils/extract-person-match-params';
import { type PersonNode } from 'src/types/person-node';

const personNode = (overrides: Partial<PersonNode> = {}): PersonNode => ({
  id: 'person-1',
  name: { firstName: 'Ada', lastName: 'Lovelace' },
  emails: { primaryEmail: 'ada@analyticalengines.com' },
  linkedinLink: { primaryLinkUrl: 'https://www.linkedin.com/in/adalovelace' },
  ...overrides,
});

afterEach(() => {
  delete process.env.CRUSTDATA_CONTACT_ENRICHMENT_ENABLED;
});

describe('extractPersonMatchParams', () => {
  it('matches on the LinkedIn profile URL', () => {
    expect(
      extractPersonMatchParams({
        node: personNode(),
        input: { records: [] },
      }),
    ).toMatchObject({
      matchOn: 'profileUrl',
      profileUrl: 'https://www.linkedin.com/in/adalovelace',
    });
  });

  it('skips a person with only an email while contact enrichment is off', () => {
    expect(
      extractPersonMatchParams({
        node: personNode({ linkedinLink: null }),
        input: { records: [] },
      }),
    ).toBeUndefined();
  });

  it('falls back to the business email when contact enrichment is on', () => {
    expect(
      extractPersonMatchParams({
        node: personNode({ linkedinLink: null }),
        input: { records: [], enrichContactData: true },
      }),
    ).toEqual({
      matchOn: 'businessEmail',
      businessEmail: 'ada@analyticalengines.com',
    });
  });

  it('prefers the profile URL over the email fallback', () => {
    expect(
      extractPersonMatchParams({
        node: personNode(),
        input: { records: [], enrichContactData: true },
      }),
    ).toMatchObject({ matchOn: 'profileUrl' });
  });

  it('skips a person with a name and company but no LinkedIn URL or email', () => {
    expect(
      extractPersonMatchParams({
        node: personNode({
          linkedinLink: null,
          emails: null,
          company: { id: 'company-1', name: 'Analytical Engines' },
        }),
        input: { records: [] },
      }),
    ).toBeUndefined();
  });

  it('leaves contact enrichment off by default', () => {
    expect(
      extractPersonMatchParams({
        node: personNode(),
        input: { records: [] },
      }),
    ).toMatchObject({ enrichContactData: false });
  });

  it('turns contact enrichment on from the server variable', () => {
    process.env.CRUSTDATA_CONTACT_ENRICHMENT_ENABLED = 'true';

    expect(
      extractPersonMatchParams({
        node: personNode(),
        input: { records: [] },
      }),
    ).toMatchObject({ enrichContactData: true });
  });

  it('lets the run input override the server variable', () => {
    process.env.CRUSTDATA_CONTACT_ENRICHMENT_ENABLED = 'true';

    expect(
      extractPersonMatchParams({
        node: personNode(),
        input: { records: [], enrichContactData: false },
      }),
    ).toMatchObject({ enrichContactData: false });
  });
});

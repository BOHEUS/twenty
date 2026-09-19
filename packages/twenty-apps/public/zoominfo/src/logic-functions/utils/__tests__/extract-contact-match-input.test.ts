import { afterEach, describe, expect, it } from 'vitest';

import { extractContactMatchInput } from 'src/logic-functions/utils/extract-contact-match-input';
import { type PersonNode } from 'src/types/person-node';

const buildInput = () => ({ records: [] });

afterEach(() => {
  delete process.env.ZOOMINFO_CONTACT_MIN_ACCURACY_SCORE;
});

describe('extractContactMatchInput', () => {
  it('re-matches on the stored ZoomInfo id alone', () => {
    const node: PersonNode = {
      id: 'record-1',
      zoomInfoContactId: '4191419698',
      emails: { primaryEmail: 'ada@example.com' },
    };

    expect(
      extractContactMatchInput({ node, input: buildInput() }),
    ).toEqual({ personId: 4191419698 });
  });

  it('skips a person with nothing but a name', () => {
    const node: PersonNode = {
      id: 'record-1',
      name: { firstName: 'Ada', lastName: 'Lovelace' },
    };

    expect(
      extractContactMatchInput({ node, input: buildInput() }),
    ).toBeUndefined();
  });

  it('uses the name once an employer is known', () => {
    const node: PersonNode = {
      id: 'record-1',
      name: { firstName: 'Ada', lastName: 'Lovelace' },
      company: { id: 'company-1', name: 'Acme' },
    };

    expect(extractContactMatchInput({ node, input: buildInput() })).toEqual({
      fullName: 'Ada Lovelace',
      companyName: 'Acme',
    });
  });

  it('applies the configured default accuracy floor', () => {
    process.env.ZOOMINFO_CONTACT_MIN_ACCURACY_SCORE = '85';

    const node: PersonNode = {
      id: 'record-1',
      emails: { primaryEmail: 'ada@example.com' },
    };

    expect(extractContactMatchInput({ node, input: buildInput() })).toEqual({
      emailAddress: 'ada@example.com',
      contactAccuracyScoreMin: 85,
    });
  });

  it('lets an explicit workflow value win over the default', () => {
    process.env.ZOOMINFO_CONTACT_MIN_ACCURACY_SCORE = '85';

    const node: PersonNode = {
      id: 'record-1',
      emails: { primaryEmail: 'ada@example.com' },
    };

    expect(
      extractContactMatchInput({
        node,
        input: { records: [], minAccuracyScore: 50 },
      }),
    ).toEqual({
      emailAddress: 'ada@example.com',
      contactAccuracyScoreMin: 50,
    });
  });
});

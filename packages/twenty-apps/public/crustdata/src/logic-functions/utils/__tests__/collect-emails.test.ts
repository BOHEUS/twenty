import { describe, expect, it } from 'vitest';

import { collectEmails } from 'src/logic-functions/utils/collect-emails';

describe('collectEmails', () => {
  it('keeps deliverable and catch-all addresses', () => {
    expect(
      collectEmails([
        { email: 'ada@example.com', status: 'deliverable' },
        { email: 'grace@example.com', status: 'catch_all' },
      ]),
    ).toEqual(['ada@example.com', 'grace@example.com']);
  });

  it('drops addresses Crustdata marks invalid', () => {
    expect(
      collectEmails([
        { email: 'bounced@example.com', status: 'invalid' },
        { email: 'ada@example.com', status: 'deliverable' },
      ]),
    ).toEqual(['ada@example.com']);
  });

  it('returns an empty list for missing input', () => {
    expect(collectEmails(null)).toEqual([]);
    expect(collectEmails(undefined)).toEqual([]);
  });
});

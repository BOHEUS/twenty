import { describe, expect, it } from 'vitest';

import { alignResponseItems } from 'src/logic-functions/utils/align-response-items';

const buildItem = (input: Record<string, unknown>, id: string) => ({
  id,
  meta: { matchStatus: 'FULL_MATCH', input },
});

describe('alignResponseItems', () => {
  it('pairs each response with the input it echoes, whatever the order', () => {
    const matchInputs = [
      { emailAddress: 'ada@example.com' },
      { emailAddress: 'grace@example.com' },
    ];

    const aligned = alignResponseItems({
      matchInputs,
      responseItems: [
        buildItem({ emailAddress: 'grace@example.com' }, 'grace'),
        buildItem({ emailAddress: 'ada@example.com' }, 'ada'),
      ],
    });

    expect(aligned).toEqual([
      buildItem({ emailAddress: 'ada@example.com' }, 'ada'),
      buildItem({ emailAddress: 'grace@example.com' }, 'grace'),
    ]);
  });

  it('gives each duplicate input its own response', () => {
    const matchInputs = [
      { companyName: 'Acme' },
      { companyName: 'Acme' },
    ];

    const aligned = alignResponseItems({
      matchInputs,
      responseItems: [
        buildItem({ companyName: 'Acme' }, 'first'),
        buildItem({ companyName: 'Acme' }, 'second'),
      ],
    });

    expect(aligned).toEqual([
      buildItem({ companyName: 'Acme' }, 'first'),
      buildItem({ companyName: 'Acme' }, 'second'),
    ]);
  });

  it('falls back to request order when the echoed input is missing', () => {
    const responseItems = [{ id: 'a' }, { id: 'b' }];

    const aligned = alignResponseItems({
      matchInputs: [{ companyId: 1 }, { companyId: 2 }],
      responseItems,
    });

    expect(aligned).toEqual(responseItems);
  });

  it('resolves nothing rather than guessing when the counts disagree', () => {
    const aligned = alignResponseItems({
      matchInputs: [{ companyId: 1 }, { companyId: 2 }],
      responseItems: [{ id: 'a' }],
    });

    expect(aligned).toEqual([undefined, undefined]);
  });
});

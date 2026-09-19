import { describe, expect, it } from 'vitest';

import { groupRecordIdsByMatchStatus } from 'src/logic-functions/utils/enrich-chunk/group-record-ids-by-match-status';

describe('groupRecordIdsByMatchStatus', () => {
  it('collapses records sharing a status into one write group', () => {
    expect(
      groupRecordIdsByMatchStatus([
        { recordId: 'a', matchStatus: 'NO_MATCH' },
        { recordId: 'b', matchStatus: 'OPT_OUT' },
        { recordId: 'c', matchStatus: 'NO_MATCH' },
      ]),
    ).toEqual([
      ['NO_MATCH', ['a', 'c']],
      ['OPT_OUT', ['b']],
    ]);
  });

  it('returns nothing for an empty list', () => {
    expect(groupRecordIdsByMatchStatus([])).toEqual([]);
  });
});

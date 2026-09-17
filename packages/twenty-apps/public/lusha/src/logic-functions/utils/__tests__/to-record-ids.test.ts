import { describe, expect, it } from 'vitest';

import { toRecordIds } from 'src/logic-functions/utils/to-record-ids';

describe('toRecordIds', () => {
  it('should read ids, record objects and a single record alike', () => {
    expect(toRecordIds(['person-1', { id: 'person-2' }])).toEqual([
      'person-1',
      'person-2',
    ]);
    expect(toRecordIds({ id: 'person-1' })).toEqual(['person-1']);
    expect(toRecordIds('person-1')).toEqual(['person-1']);
  });

  it('should drop blank and repeated ids', () => {
    expect(
      toRecordIds(['person-1', ' ', { id: null }, 'person-1', ' person-2 ']),
    ).toEqual(['person-1', 'person-2']);
  });

  it('should return no ids for a missing input', () => {
    expect(toRecordIds(undefined)).toEqual([]);
    expect(toRecordIds(null)).toEqual([]);
  });
});

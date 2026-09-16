import { describe, expect, it } from 'vitest';

import { toRecordIds } from 'src/logic-functions/utils/to-record-ids';

describe('toRecordIds', () => {
  it('should read ids from a list of record objects', () => {
    expect(toRecordIds([{ id: 'a' }, { id: 'b' }])).toEqual(['a', 'b']);
  });

  it('should accept a single record', () => {
    expect(toRecordIds({ id: 'a' })).toEqual(['a']);
    expect(toRecordIds('a')).toEqual(['a']);
  });

  it('should drop empty ids and duplicates', () => {
    expect(toRecordIds(['a', '', { id: null }, { id: 'a' }, 'b'])).toEqual([
      'a',
      'b',
    ]);
  });

  it('should return no id when nothing was given', () => {
    expect(toRecordIds(undefined)).toEqual([]);
    expect(toRecordIds(null)).toEqual([]);
    expect(toRecordIds([])).toEqual([]);
  });
});

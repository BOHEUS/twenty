import { getRecordTableColumnFieldWidthStyle } from '@/object-record/record-table/utils/getRecordTableColumnFieldWidthStyle';

describe('getRecordTableColumnFieldWidthStyle', () => {
  it('binds width, min-width and max-width to the column width variable', () => {
    expect(getRecordTableColumnFieldWidthStyle(150)).toEqual({
      width: 'var(--record-table-column-field-150)',
      minWidth: 'var(--record-table-column-field-150)',
      maxWidth: 'var(--record-table-column-field-150)',
    });
  });
});

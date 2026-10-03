import { getRecordTableColumnFieldWidthCSSVariableName } from '@/object-record/record-table/utils/getRecordTableColumnFieldWidthCSSVariableName';
import { type CSSProperties } from 'react';

export const getRecordTableColumnFieldWidthStyle = (
  recordFieldIndex: number,
): CSSProperties => {
  const width = `var(${getRecordTableColumnFieldWidthCSSVariableName(recordFieldIndex)})`;

  return { width, minWidth: width, maxWidth: width };
};

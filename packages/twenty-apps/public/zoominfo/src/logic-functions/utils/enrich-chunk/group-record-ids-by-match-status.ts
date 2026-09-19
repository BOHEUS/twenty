import { type NotFoundRecord } from 'src/types/not-found-record';

export const groupRecordIdsByMatchStatus = (
  notFoundRecords: NotFoundRecord[],
): [string, string[]][] => {
  const recordIdsByMatchStatus = new Map<string, string[]>();

  for (const { matchStatus, recordId } of notFoundRecords) {
    const recordIds = recordIdsByMatchStatus.get(matchStatus) ?? [];
    recordIds.push(recordId);
    recordIdsByMatchStatus.set(matchStatus, recordIds);
  }

  return [...recordIdsByMatchStatus.entries()];
};

import { isArray, isString } from '@sniptt/guards';

import { runSnovTask } from 'src/logic-functions/utils/run-snov-task';
import { type SnovEmailCheck } from 'src/types/snov-email-check';
import { isDefined } from 'src/utils/is-defined';
import { isRecord } from 'src/utils/is-record';

const WHITESPACE_REGEX = /\s+/g;

const toPersonName = (...nameParts: string[]) =>
  nameParts.join(' ').trim().replace(WHITESPACE_REGEX, ' ').toLowerCase();

type EmailFinderRow = { firstName: string; lastName: string; domain: string };

type FindSnovEmailsByNameResult =
  | { ok: true; emailChecksByRow: SnovEmailCheck[][] }
  | { ok: false; httpStatus: number; message: string };

export const findSnovEmailsByName = async ({
  rows,
  deadline,
}: {
  rows: EmailFinderRow[];
  deadline: number;
}): Promise<FindSnovEmailsByNameResult> => {
  if (rows.length === 0) {
    return { ok: true, emailChecksByRow: [] };
  }

  const task = await runSnovTask({
    startPath: '/v2/emails-by-domain-by-name/start',
    startBody: {
      json: {
        rows: rows.map((row) => ({
          first_name: row.firstName,
          last_name: row.lastName,
          domain: row.domain,
        })),
      },
    },
    toResultPath: (taskHash) =>
      `/v2/emails-by-domain-by-name/result?task_hash=${encodeURIComponent(taskHash)}`,
    deadline,
  });

  if (task.status === 'in_progress') {
    return {
      ok: false,
      httpStatus: 0,
      message: 'Snov.io is still finding emails. Run the enrichment again.',
    };
  }

  if (task.status === 'error') {
    return { ok: false, httpStatus: task.httpStatus, message: task.message };
  }

  const items = (isArray(task.json.data) ? task.json.data : []).filter(
    isRecord,
  );

  // Each result names the person it belongs to, so a missing row can't shift
  // one person's emails onto another
  return {
    ok: true,
    emailChecksByRow: rows.map((row) => {
      const rowName = toPersonName(row.firstName, row.lastName);
      const item = items.find(
        (candidate) =>
          isString(candidate.people) &&
          toPersonName(candidate.people) === rowName,
      );

      return isDefined(item) && isArray(item.result)
        ? (item.result.filter(isRecord) as SnovEmailCheck[])
        : [];
    }),
  };
};

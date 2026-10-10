import { awaitSnovTask } from 'src/logic-functions/utils/await-snov-task';
import { callSnov } from 'src/logic-functions/utils/call-snov';
import { readTaskHash } from 'src/logic-functions/utils/read-task-hash';
import { type SnovTaskResult } from 'src/types/snov-task-result';
import { isDefined } from 'src/utils/is-defined';

export const runSnovTask = async ({
  startPath,
  startBody,
  toResultPath,
  deadline,
}: {
  startPath: string;
  startBody: Parameters<typeof callSnov>[0]['body'];
  toResultPath: (taskHash: string) => string;
  deadline: number;
}): Promise<SnovTaskResult> => {
  const start = await callSnov({
    method: 'POST',
    path: startPath,
    body: startBody,
  });

  if (!start.ok) {
    return {
      status: 'error',
      httpStatus: start.httpStatus,
      message: start.message,
    };
  }

  const taskHash = readTaskHash(start.json);

  if (!isDefined(taskHash)) {
    return {
      status: 'error',
      httpStatus: start.httpStatus,
      message: 'Snov.io did not start the task.',
    };
  }

  return awaitSnovTask({ resultPath: toResultPath(taskHash), deadline });
};

import { isNonEmptyString } from '@sniptt/guards';

import { SNOV_TASK_POLL_INTERVAL_MS } from 'src/constants/snov-request-timing';
import { callSnov } from 'src/logic-functions/utils/call-snov';
import { sleep } from 'src/logic-functions/utils/sleep';
import { type SnovTaskResult } from 'src/types/snov-task-result';

// not_enough_credits is reported as a task status, not an HTTP error
const NOT_ENOUGH_CREDITS_STATUS = 'not_enough_credits';

export const awaitSnovTask = async ({
  resultPath,
  deadline,
}: {
  resultPath: string;
  deadline: number;
}): Promise<SnovTaskResult> => {
  for (;;) {
    const response = await callSnov({ method: 'GET', path: resultPath });

    if (!response.ok) {
      return {
        status: 'error',
        httpStatus: response.httpStatus,
        message: response.message,
      };
    }

    const taskStatus = response.json.status;

    if (taskStatus === NOT_ENOUGH_CREDITS_STATUS) {
      return {
        status: 'error',
        httpStatus: 403,
        message: 'The Snov.io account does not have enough credits.',
      };
    }

    if (taskStatus === 'completed') {
      return { status: 'completed', json: response.json };
    }

    if (isNonEmptyString(taskStatus) && taskStatus !== 'in_progress') {
      return {
        status: 'error',
        httpStatus: response.httpStatus,
        message: `Snov.io task ended with status ${taskStatus}.`,
      };
    }

    if (Date.now() + SNOV_TASK_POLL_INTERVAL_MS > deadline) {
      return { status: 'in_progress' };
    }

    await sleep(SNOV_TASK_POLL_INTERVAL_MS);
  }
};

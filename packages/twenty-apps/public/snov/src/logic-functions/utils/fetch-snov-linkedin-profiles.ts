import { isArray, isNonEmptyString } from '@sniptt/guards';

import { normalizeLinkedinUrl } from 'src/logic-functions/utils/normalize-linkedin-url';
import { runSnovTask } from 'src/logic-functions/utils/run-snov-task';
import { type SnovLinkedinProfile } from 'src/types/snov-linkedin-profile';
import { isRecord } from 'src/utils/is-record';

type FetchSnovLinkedinProfilesResult =
  | { ok: true; profileByUrl: Map<string, SnovLinkedinProfile> }
  | { ok: false; httpStatus: number; message: string };

export const fetchSnovLinkedinProfiles = async ({
  urls,
  deadline,
}: {
  urls: string[];
  deadline: number;
}): Promise<FetchSnovLinkedinProfilesResult> => {
  if (urls.length === 0) {
    return { ok: true, profileByUrl: new Map() };
  }

  const form = new URLSearchParams();
  urls.forEach((url) => form.append('urls[]', url));

  const task = await runSnovTask({
    startPath: '/v2/li-profiles-by-urls/start',
    startBody: { form },
    toResultPath: (taskHash) =>
      `/v2/li-profiles-by-urls/result?task_hash=${encodeURIComponent(taskHash)}`,
    deadline,
  });

  if (task.status === 'in_progress') {
    return {
      ok: false,
      httpStatus: 0,
      message:
        'Snov.io is still looking up LinkedIn profiles. Run the enrichment again.',
    };
  }

  if (task.status === 'error') {
    return { ok: false, httpStatus: task.httpStatus, message: task.message };
  }

  const profileByUrl = new Map<string, SnovLinkedinProfile>();

  for (const item of isArray(task.json.data) ? task.json.data : []) {
    // An unmatched URL comes back with an empty array as its result
    if (isRecord(item) && isNonEmptyString(item.url) && isRecord(item.result)) {
      profileByUrl.set(
        normalizeLinkedinUrl(item.url) ?? item.url,
        item.result as SnovLinkedinProfile,
      );
    }
  }

  return { ok: true, profileByUrl };
};

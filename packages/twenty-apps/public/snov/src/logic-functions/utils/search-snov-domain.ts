import { isNonEmptyString } from '@sniptt/guards';

import { runSnovTask } from 'src/logic-functions/utils/run-snov-task';
import { type SnovCompanyData } from 'src/types/snov-company-data';
import { type SnovEnrichResult } from 'src/types/snov-enrich-result';
import { isRecord } from 'src/utils/is-record';

export const searchSnovDomain = async ({
  domain,
  deadline,
}: {
  domain: string;
  deadline: number;
}): Promise<SnovEnrichResult<SnovCompanyData>> => {
  const task = await runSnovTask({
    startPath: '/v2/domain-search/start',
    startBody: { form: new URLSearchParams({ domain }) },
    toResultPath: (taskHash) =>
      `/v2/domain-search/result/${encodeURIComponent(taskHash)}`,
    deadline,
  });

  if (task.status === 'in_progress') {
    return {
      outcome: 'error',
      httpStatus: 0,
      message:
        'Snov.io is still searching this domain. Run the enrichment again.',
    };
  }

  if (task.status === 'error') {
    return {
      outcome: 'error',
      httpStatus: task.httpStatus,
      message: task.message,
    };
  }

  const companyData = isRecord(task.json.data) ? task.json.data : undefined;

  return companyData !== undefined && isNonEmptyString(companyData.company_name)
    ? { outcome: 'matched', data: companyData as SnovCompanyData }
    : { outcome: 'not_found' };
};

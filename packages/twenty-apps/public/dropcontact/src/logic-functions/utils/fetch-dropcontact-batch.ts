import { isArray, isNonEmptyString } from '@sniptt/guards';

import { callDropcontact } from 'src/logic-functions/utils/call-dropcontact';
import { type DropcontactBatchStatus } from 'src/types/dropcontact-batch-status';
import { type DropcontactPersonData } from 'src/types/dropcontact-person-data';
import { isRecord } from 'src/utils/is-record';

export const fetchDropcontactBatch = async (
  requestId: string,
): Promise<DropcontactBatchStatus> => {
  const response = await callDropcontact({
    method: 'GET',
    path: `/enrich/all/${encodeURIComponent(requestId)}`,
  });

  if (!response.ok) {
    return response.httpStatus === 404
      ? { status: 'missing' }
      : {
          status: 'error',
          httpStatus: response.httpStatus,
          message: response.message,
        };
  }

  if (response.json.success !== true) {
    const reason = isNonEmptyString(response.json.reason)
      ? response.json.reason
      : undefined;
    const isStillProcessing =
      response.json.error !== true ||
      reason?.toLowerCase().includes('not ready') === true;

    return isStillProcessing
      ? { status: 'processing' }
      : {
          status: 'error',
          httpStatus: response.httpStatus,
          message: reason ?? 'Dropcontact could not process the batch.',
        };
  }

  const contacts = isArray(response.json.data)
    ? response.json.data.filter(isRecord)
    : [];

  // The response body is untyped JSON; fields are read defensively by the mappers
  return { status: 'ready', contacts: contacts as DropcontactPersonData[] };
};

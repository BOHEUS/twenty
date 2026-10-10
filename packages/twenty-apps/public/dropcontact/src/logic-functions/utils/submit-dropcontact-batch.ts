import { isNonEmptyString } from '@sniptt/guards';

import { callDropcontact } from 'src/logic-functions/utils/call-dropcontact';
import { readFrenchRegistrySetting } from 'src/logic-functions/utils/read-french-registry-setting';
import { type DropcontactContactInput } from 'src/types/dropcontact-contact-input';

type SubmitDropcontactBatchResult =
  | { ok: true; requestId: string }
  | { ok: false; httpStatus: number; message: string };

export const submitDropcontactBatch = async (
  contacts: DropcontactContactInput[],
): Promise<SubmitDropcontactBatchResult> => {
  const response = await callDropcontact({
    method: 'POST',
    path: '/enrich/all',
    body: {
      data: contacts,
      siren: readFrenchRegistrySetting(),
      language: 'en',
    },
  });

  if (!response.ok) {
    return response;
  }

  const requestId = response.json.request_id;

  if (response.json.success !== true || !isNonEmptyString(requestId)) {
    return {
      ok: false,
      httpStatus: response.httpStatus,
      message: isNonEmptyString(response.json.reason)
        ? response.json.reason
        : 'Dropcontact did not accept the batch.',
    };
  }

  return { ok: true, requestId };
};

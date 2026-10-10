import { awaitDropcontactBatches } from 'src/logic-functions/utils/await-dropcontact-batches';
import { chargeDropcontactCredits } from 'src/logic-functions/utils/charge-dropcontact-credits';
import { countDropcontactCredits } from 'src/logic-functions/utils/count-dropcontact-credits';
import { fetchDropcontactBatch } from 'src/logic-functions/utils/fetch-dropcontact-batch';
import { getDropcontactCreditCostDollars } from 'src/logic-functions/utils/get-dropcontact-credit-cost-dollars';
import { isEnrichedContact } from 'src/logic-functions/utils/is-enriched-contact';
import { readDropcontactRecordId } from 'src/logic-functions/utils/read-dropcontact-record-id';
import { submitDropcontactBatch } from 'src/logic-functions/utils/submit-dropcontact-batch';
import { type DropcontactBatchStatus } from 'src/types/dropcontact-batch-status';
import { type DropcontactEnrichResult } from 'src/types/dropcontact-enrich-result';
import { type DropcontactMatchParams } from 'src/types/dropcontact-match-params';
import { type DropcontactPersonData } from 'src/types/dropcontact-person-data';
import { isDefined } from 'src/utils/is-defined';

type PersonEnrichResult = DropcontactEnrichResult<DropcontactPersonData>;

const RESOURCE_CONTEXT = 'dropcontact/person';

const toResultsFromBatch = ({
  batchStatus,
  requestId,
  params,
}: {
  batchStatus: DropcontactBatchStatus | undefined;
  requestId: string;
  params: DropcontactMatchParams[];
}): PersonEnrichResult[] => {
  if (!isDefined(batchStatus) || batchStatus.status === 'processing') {
    return params.map(() => ({ outcome: 'pending', requestId }));
  }

  if (batchStatus.status === 'error' || batchStatus.status === 'missing') {
    return params.map(() =>
      batchStatus.status === 'missing'
        ? {
            outcome: 'error',
            httpStatus: 404,
            message: 'Dropcontact no longer has this batch.',
          }
        : {
            outcome: 'error',
            httpStatus: batchStatus.httpStatus,
            message: batchStatus.message,
          },
    );
  }

  const contactByRecordId = new Map(
    batchStatus.contacts.flatMap((contact) => {
      const recordId = readDropcontactRecordId(contact);

      return isDefined(recordId) ? [[recordId, contact] as const] : [];
    }),
  );

  return params.map((entry): PersonEnrichResult => {
    const contact = contactByRecordId.get(entry.recordId);

    return isDefined(contact) &&
      isEnrichedContact({ contact, input: entry.contact })
      ? { outcome: 'matched', data: contact }
      : { outcome: 'not_found' };
  });
};

export const enrichPeople = async (
  params: DropcontactMatchParams[],
  { deadline }: { deadline: number },
): Promise<PersonEnrichResult[]> => {
  const creditCostDollars = getDropcontactCreditCostDollars();
  const paramsByRequestId = new Map<string, DropcontactMatchParams[]>();
  const resultByRecordId = new Map<string, PersonEnrichResult>();

  for (const entry of params) {
    if (isDefined(entry.pendingRequestId)) {
      paramsByRequestId.set(entry.pendingRequestId, [
        ...(paramsByRequestId.get(entry.pendingRequestId) ?? []),
        entry,
      ]);
    }
  }

  const pendingRequestIds = [...paramsByRequestId.keys()];
  const pendingStatuses = await Promise.all(
    pendingRequestIds.map(fetchDropcontactBatch),
  );
  const expiredParams = pendingRequestIds.flatMap((requestId, index) => {
    if (pendingStatuses[index].status !== 'missing') {
      return [];
    }

    const expiredRequestParams = paramsByRequestId.get(requestId) ?? [];
    paramsByRequestId.delete(requestId);

    return expiredRequestParams;
  });

  const paramsToSubmit = [
    ...params.filter((entry) => !isDefined(entry.pendingRequestId)),
    ...expiredParams,
  ];

  if (paramsToSubmit.length > 0) {
    const submission = await submitDropcontactBatch(
      paramsToSubmit.map((entry) => entry.contact),
    );

    if (submission.ok) {
      paramsByRequestId.set(submission.requestId, paramsToSubmit);
    } else {
      for (const entry of paramsToSubmit) {
        resultByRecordId.set(entry.recordId, {
          outcome: 'error',
          httpStatus: submission.httpStatus,
          message: submission.message,
        });
      }
    }
  }

  const statusByRequestId = await awaitDropcontactBatches({
    requestIds: [...paramsByRequestId.keys()],
    deadline,
  });

  for (const [requestId, requestParams] of paramsByRequestId) {
    const batchStatus = statusByRequestId.get(requestId);

    if (batchStatus?.status === 'ready') {
      // A stored batch can be collected record by record across runs, so only
      // the contacts collected now are billed
      const collectedRecordIds = new Set(
        requestParams.map((entry) => entry.recordId),
      );

      await chargeDropcontactCredits({
        dropcontactCredits: countDropcontactCredits(
          batchStatus.contacts.filter((contact) =>
            collectedRecordIds.has(readDropcontactRecordId(contact) ?? ''),
          ),
        ),
        creditCostDollars,
        resourceContext: RESOURCE_CONTEXT,
      });
    }

    toResultsFromBatch({
      batchStatus,
      requestId,
      params: requestParams,
    }).forEach((result, index) =>
      resultByRecordId.set(requestParams[index].recordId, result),
    );
  }

  return params.map(
    (entry) =>
      resultByRecordId.get(entry.recordId) ?? {
        outcome: 'error',
        httpStatus: 0,
        message: 'Dropcontact returned no result for this record.',
      },
  );
};

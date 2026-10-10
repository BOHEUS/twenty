import { DROPCONTACT_POLL_INTERVAL_MS } from 'src/constants/dropcontact-polling';
import { fetchDropcontactBatch } from 'src/logic-functions/utils/fetch-dropcontact-batch';
import { sleep } from 'src/logic-functions/utils/sleep';
import { type DropcontactBatchStatus } from 'src/types/dropcontact-batch-status';

export const awaitDropcontactBatches = async ({
  requestIds,
  deadline,
}: {
  requestIds: string[];
  deadline: number;
}): Promise<Map<string, DropcontactBatchStatus>> => {
  const statusByRequestId = new Map<string, DropcontactBatchStatus>();
  let unsettledRequestIds = requestIds;

  while (unsettledRequestIds.length > 0) {
    const statuses = await Promise.all(
      unsettledRequestIds.map(fetchDropcontactBatch),
    );

    unsettledRequestIds.forEach((requestId, index) =>
      statusByRequestId.set(requestId, statuses[index]),
    );
    unsettledRequestIds = unsettledRequestIds.filter(
      (requestId) => statusByRequestId.get(requestId)?.status === 'processing',
    );

    if (
      unsettledRequestIds.length === 0 ||
      Date.now() + DROPCONTACT_POLL_INTERVAL_MS > deadline
    ) {
      break;
    }

    await sleep(DROPCONTACT_POLL_INTERVAL_MS);
  }

  return statusByRequestId;
};

import { isNumber } from '@sniptt/guards';

import { COGNISM_REDEEM_BATCH_SIZE } from 'src/constants/cognism-redeem-batch-size';
import { chunk } from 'src/logic-functions/utils/chunk';
import { extractCognismItems } from 'src/logic-functions/utils/extract-cognism-items';
import { parseCognismMatch } from 'src/logic-functions/utils/parse-cognism-match';
import { postCognismRedeem } from 'src/logic-functions/utils/post-cognism-redeem';
import { postCognismRequest } from 'src/logic-functions/utils/post-cognism-request';
import { type CognismEnrichResult } from 'src/logic-functions/types/cognism-enrich-result';
import { isDefined } from 'src/logic-functions/data/is-defined';

export type CognismEnrichmentRequest = {
  criteria: Record<string, unknown>;
  minMatchScore?: number;
};

export const runCognismEnrichment = async <TData>({
  enrichPath,
  redeemPath,
  collectionKey,
  requests,
}: {
  enrichPath: string;
  redeemPath: string;
  collectionKey: string;
  requests: CognismEnrichmentRequest[];
}): Promise<CognismEnrichResult<TData>[]> => {
  if (requests.length === 0) {
    return [];
  }

  const failAll = ({
    message,
    httpStatus,
  }: {
    message: string;
    httpStatus: number;
  }): CognismEnrichResult<TData>[] =>
    requests.map(() => ({ outcome: 'error', httpStatus, message }));

  const enrichOutcome = await postCognismRequest({
    path: enrichPath,
    body: { [collectionKey]: requests.map((request) => request.criteria) },
  });

  if (!enrichOutcome.ok) {
    return failAll({
      message: enrichOutcome.message,
      httpStatus: enrichOutcome.httpStatus,
    });
  }

  const enrichItems = extractCognismItems(enrichOutcome.json);

  if (!isDefined(enrichItems)) {
    return failAll({
      message: `Cognism returned an unexpected enrich payload (HTTP ${enrichOutcome.httpStatus}).`,
      httpStatus: enrichOutcome.httpStatus,
    });
  }

  if (enrichItems.length !== requests.length) {
    return failAll({
      message: `Cognism returned ${enrichItems.length} enrich results for ${requests.length} requests (HTTP ${enrichOutcome.httpStatus}).`,
      httpStatus: enrichOutcome.httpStatus,
    });
  }

  const httpStatus = enrichOutcome.httpStatus;
  const matchScoreByRedeemId = new Map<string, number | undefined>();
  const redeemIdByIndex = requests.map((request, index) => {
    const match = parseCognismMatch(enrichItems[index]);

    if (!isDefined(match) || !isDefined(match.redeemId)) {
      return undefined;
    }

    const matchScore = isNumber(match.matchScore)
      ? match.matchScore
      : undefined;
    const minMatchScore = request.minMatchScore;

    if (
      isNumber(minMatchScore) &&
      (!isNumber(matchScore) || matchScore < minMatchScore)
    ) {
      return undefined;
    }

    matchScoreByRedeemId.set(match.redeemId, matchScore);

    return match.redeemId;
  });

  const uniqueRedeemIds = Array.from(
    new Set(redeemIdByIndex.filter(isDefined)),
  );

  const dataByRedeemId = new Map<string, TData>();
  const redeemErrorByRedeemId = new Map<string, string>();

  for (const redeemIdsChunk of chunk({
    items: uniqueRedeemIds,
    size: COGNISM_REDEEM_BATCH_SIZE,
  })) {
    const redeemOutcome = await postCognismRedeem<TData>({
      path: redeemPath,
      redeemIds: redeemIdsChunk,
    });

    if (!redeemOutcome.ok) {
      for (const redeemId of redeemIdsChunk) {
        redeemErrorByRedeemId.set(redeemId, redeemOutcome.message);
      }
      continue;
    }

    for (const [redeemId, data] of redeemOutcome.dataByRedeemId) {
      dataByRedeemId.set(redeemId, data);
    }
  }

  return redeemIdByIndex.map((redeemId) => {
    if (!isDefined(redeemId)) {
      return { outcome: 'not_found', httpStatus };
    }

    const redeemError = redeemErrorByRedeemId.get(redeemId);
    if (isDefined(redeemError)) {
      return { outcome: 'error', httpStatus, message: redeemError };
    }

    const data = dataByRedeemId.get(redeemId);
    if (!isDefined(data)) {
      return { outcome: 'not_found', httpStatus };
    }

    return {
      outcome: 'matched',
      httpStatus,
      matchScore: matchScoreByRedeemId.get(redeemId),
      data,
    };
  });
};

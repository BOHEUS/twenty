import { isObject } from '@sniptt/guards';

import { extractCognismItems } from 'src/logic-functions/utils/extract-cognism-items';
import { postCognismRequest } from 'src/logic-functions/utils/post-cognism-request';
import { toText } from 'src/logic-functions/utils/to-text';
import { isDefined } from 'src/logic-functions/data/is-defined';

export type CognismRedeemOutcome<TData> =
  | { ok: true; dataByRedeemId: Map<string, TData> }
  | { ok: false; httpStatus: number; message: string };

export const postCognismRedeem = async <TData>({
  path,
  redeemIds,
}: {
  path: string;
  redeemIds: string[];
}): Promise<CognismRedeemOutcome<TData>> => {
  const outcome = await postCognismRequest({ path, body: { redeemIds } });

  if (!outcome.ok) {
    return {
      ok: false,
      httpStatus: outcome.httpStatus,
      message: outcome.message,
    };
  }

  const items = extractCognismItems(outcome.json);

  if (!isDefined(items)) {
    return {
      ok: false,
      httpStatus: outcome.httpStatus,
      message: `Cognism returned an unexpected redeem payload (HTTP ${outcome.httpStatus}).`,
    };
  }

  const dataByRedeemId = new Map<string, TData>();

  for (const [index, item] of items.entries()) {
    if (!isObject(item)) {
      continue;
    }

    // Cognism does not guarantee it echoes redeemId back, so fall back to the
    // request order, which it does preserve.
    const redeemId =
      toText((item as Record<string, unknown>).redeemId) ?? redeemIds[index];

    if (isDefined(redeemId)) {
      dataByRedeemId.set(redeemId, item as TData);
    }
  }

  return { ok: true, dataByRedeemId };
};

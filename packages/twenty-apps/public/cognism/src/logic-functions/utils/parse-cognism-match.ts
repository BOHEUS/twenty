import { isObject } from '@sniptt/guards';

import { toNumber } from 'src/logic-functions/utils/to-number';
import { toText } from 'src/logic-functions/utils/to-text';
import { type CognismEnrichMatch } from 'src/logic-functions/types/cognism-enrich-match';
import { isDefined } from 'src/logic-functions/data/is-defined';

export const parseCognismMatch = (
  item: unknown,
): CognismEnrichMatch | undefined => {
  if (!isObject(item)) {
    return undefined;
  }

  const match = item as Record<string, unknown>;
  const redeemId = toText(match.redeemId) ?? toText(match.redeem_id);

  if (!isDefined(redeemId)) {
    return undefined;
  }

  return { redeemId, matchScore: toNumber(match.matchScore) ?? null };
};

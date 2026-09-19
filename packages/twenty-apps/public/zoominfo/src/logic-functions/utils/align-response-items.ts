import { isDefined } from 'twenty-sdk/utils';

import { buildMatchInputKey } from 'src/logic-functions/utils/build-match-input-key';
import { isRecord } from 'src/utils/is-record';

const readEchoedInput = (responseItem: unknown): unknown =>
  isRecord(responseItem) && isRecord(responseItem.meta)
    ? responseItem.meta.input
    : undefined;

// ZoomInfo echoes each request entry back on meta.input, which is the only
// reliable way to pair a response with the record it was requested for. Falling
// back to array order would otherwise risk writing one person's data onto
// another.
export const alignResponseItems = <TInput>({
  matchInputs,
  responseItems,
}: {
  matchInputs: TInput[];
  responseItems: unknown[];
}): (unknown | undefined)[] => {
  const responseItemsByInputKey = new Map<string, unknown[]>();

  for (const responseItem of responseItems) {
    const inputKey = buildMatchInputKey(readEchoedInput(responseItem));
    const queue = responseItemsByInputKey.get(inputKey) ?? [];
    queue.push(responseItem);
    responseItemsByInputKey.set(inputKey, queue);
  }

  const alignedByEchoedInput = matchInputs.map((matchInput) =>
    responseItemsByInputKey.get(buildMatchInputKey(matchInput))?.shift(),
  );

  if (alignedByEchoedInput.every(isDefined)) {
    return alignedByEchoedInput;
  }

  if (responseItems.length === matchInputs.length) {
    return responseItems;
  }

  return matchInputs.map(() => undefined);
};

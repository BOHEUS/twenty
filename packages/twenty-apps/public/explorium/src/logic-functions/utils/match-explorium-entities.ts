import { isNonEmptyString } from '@sniptt/guards';

import { postExplorium } from 'src/logic-functions/utils/post-explorium';
import { type ExploriumMatchResult } from 'src/types/explorium-match-result';
import { isRecord } from 'src/utils/is-record';

export const matchExploriumEntities = async ({
  path,
  inputsKey,
  matchesKey,
  idKey,
  inputs,
  resourceContext,
}: {
  path: string;
  inputsKey: string;
  matchesKey: string;
  idKey: string;
  inputs: Record<string, unknown>[];
  resourceContext: string;
}): Promise<ExploriumMatchResult[]> => {
  if (inputs.length === 0) {
    return [];
  }

  const response = await postExplorium({
    path,
    body: { [inputsKey]: inputs },
    resourceContext,
  });

  if (!response.ok) {
    return inputs.map(() => ({
      outcome: 'error',
      httpStatus: response.httpStatus,
      message: response.message,
    }));
  }

  const matches = response.json[matchesKey];

  if (!Array.isArray(matches) || matches.length !== inputs.length) {
    return inputs.map(() => ({
      outcome: 'error',
      httpStatus: 200,
      message: `Explorium returned ${Array.isArray(matches) ? matches.length : 0} matches for ${inputs.length} inputs.`,
    }));
  }

  return matches.map((match): ExploriumMatchResult => {
    if (!isRecord(match)) {
      return { outcome: 'not_found' };
    }

    const matchedId = match[idKey];

    if (isNonEmptyString(matchedId)) {
      return { outcome: 'matched', id: matchedId };
    }

    if (isNonEmptyString(match.error)) {
      return { outcome: 'error', httpStatus: 200, message: match.error };
    }

    return { outcome: 'not_found' };
  });
};

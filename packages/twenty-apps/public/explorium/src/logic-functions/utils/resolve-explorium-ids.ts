import { type ExploriumMatchParams } from 'src/types/explorium-match-params';
import { type ExploriumMatchResult } from 'src/types/explorium-match-result';

export const resolveExploriumIds = async <TMatchInput>({
  params,
  match,
}: {
  params: ExploriumMatchParams<TMatchInput>[];
  match: (matchInputs: TMatchInput[]) => Promise<ExploriumMatchResult[]>;
}): Promise<ExploriumMatchResult[]> => {
  const matchInputs: TMatchInput[] = [];
  const paramsIndexByMatchIndex: number[] = [];

  params.forEach((entry, index) => {
    if ('matchInput' in entry) {
      matchInputs.push(entry.matchInput);
      paramsIndexByMatchIndex.push(index);
    }
  });

  const matchResults = await match(matchInputs);
  const matchResultByParamsIndex = new Map(
    paramsIndexByMatchIndex.map((paramsIndex, matchIndex) => [
      paramsIndex,
      matchResults[matchIndex],
    ]),
  );

  return params.map(
    (entry, index): ExploriumMatchResult =>
      'exploriumId' in entry
        ? { outcome: 'matched', id: entry.exploriumId }
        : (matchResultByParamsIndex.get(index) ?? { outcome: 'not_found' }),
  );
};

import { extractCrustdataErrorMessage } from 'src/logic-functions/utils/extract-crustdata-error-message';
import {
  indexResultsByMatchedOn,
  parseCrustdataItem,
} from 'src/logic-functions/utils/parse-crustdata-match';
import {
  CrustdataRequestError,
  postCrustdata,
} from 'src/logic-functions/utils/post-crustdata';
import { type CrustdataEnrichResult } from 'src/types/crustdata-enrich-result';
import { toErrorMessage } from 'src/utils/to-error-message';

export type IdentifierEnrichBatch<TData> = {
  resultByIdentifier: Map<string, CrustdataEnrichResult<TData>>;
  creditsUsed: number;
};

// Every enrich endpoint takes a list of identifiers and echoes each one back in `matched_on`, so
// people, companies and contacts all share this request-and-stitch. Results key on the lowercased
// identifier, because Crustdata matches identifiers case-insensitively. A request that never lands
// fails its whole batch, since Crustdata said nothing about any identifier in it.
export const enrichIdentifiers = async <TData>({
  path,
  body,
  identifiers,
  dataKey,
}: {
  path: string;
  body: Record<string, unknown>;
  identifiers: string[];
  dataKey: 'person_data' | 'company_data';
}): Promise<IdentifierEnrichBatch<TData>> => {
  const resultByIdentifier = new Map<string, CrustdataEnrichResult<TData>>();

  if (identifiers.length === 0) {
    return { resultByIdentifier, creditsUsed: 0 };
  }

  const failAll = ({
    message,
    httpStatus,
  }: {
    message: string;
    httpStatus: number;
  }) => {
    for (const identifier of identifiers) {
      resultByIdentifier.set(identifier.toLowerCase(), {
        outcome: 'error',
        httpStatus,
        message,
      });
    }

    return resultByIdentifier;
  };

  try {
    const { json, httpStatus, creditsUsed } = await postCrustdata({ path, body });

    if (httpStatus < 200 || httpStatus >= 300) {
      return {
        resultByIdentifier: failAll({
          message: extractCrustdataErrorMessage({ json, httpStatus }),
          httpStatus,
        }),
        creditsUsed,
      };
    }

    const resultByMatchedOn = indexResultsByMatchedOn(json);

    for (const identifier of identifiers) {
      resultByIdentifier.set(
        identifier.toLowerCase(),
        parseCrustdataItem<TData>({
          item: resultByMatchedOn.get(identifier.toLowerCase()),
          httpStatus,
          dataKey,
        }),
      );
    }

    return { resultByIdentifier, creditsUsed };
  } catch (enrichError) {
    return {
      resultByIdentifier: failAll({
        message: toErrorMessage(enrichError),
        httpStatus:
          enrichError instanceof CrustdataRequestError
            ? enrichError.httpStatus
            : 0,
      }),
      creditsUsed: 0,
    };
  }
};

import { type CoreApiClient } from 'twenty-client-sdk/core';

import { type ApolloApiResult } from 'src/logic-functions/types/apollo-api-result.type';
import { type ApolloRecord } from 'src/logic-functions/types/apollo-record.type';

export type BulkEnrichmentAdapter<
  TRecord extends { id: string },
  TMatchParams,
> = {
  objectNameSingular: string;
  noIdentifierMessage: string;
  notFoundMessage: string;
  readRecords: (args: {
    client: CoreApiClient;
    recordIds: string[];
  }) => Promise<TRecord[]>;
  buildMatchParams: (record: TRecord) => TMatchParams | undefined;
  fetchMatches: (args: {
    params: TMatchParams[];
    accessToken: string;
    revealPersonalEmails: boolean;
  }) => Promise<ApolloApiResult<(ApolloRecord | undefined)[]>>;
  buildData: (args: {
    match: ApolloRecord;
    enrichedAt: string;
  }) => Record<string, unknown>;
  updateRecord: (args: {
    client: CoreApiClient;
    recordId: string;
    data: Record<string, unknown>;
  }) => Promise<void>;
  updateManyStatus: (args: {
    client: CoreApiClient;
    recordIds: string[];
    data: Record<string, unknown>;
  }) => Promise<void>;
};

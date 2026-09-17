import { type CoreApiClient } from 'twenty-client-sdk/core';

import { type LushaApiResult } from 'src/logic-functions/types/lusha-api-result.type';
import { type LushaRecord } from 'src/logic-functions/types/lusha-record.type';

export type EnrichmentAdapter<
  TRecord extends { id: string },
  TSearchItem extends { clientReferenceId: string },
> = {
  objectNameSingular: string;
  noIdentifierMessage: string;
  notFoundMessage: string;
  // Composite fields the server can refuse on their own, such as an email that
  // another person already uses; the write is retried without them.
  fieldNamesDroppableOnWriteFailure: string[];
  readRecords: (args: {
    client: CoreApiClient;
    recordIds: string[];
  }) => Promise<TRecord[]>;
  buildSearchItem: (record: TRecord) => TSearchItem | undefined;
  searchAndEnrich: (args: {
    apiKey: string;
    items: TSearchItem[];
    revealPhones: boolean;
  }) => Promise<LushaApiResult<LushaRecord[]>>;
  buildUpdateData: (args: {
    client: CoreApiClient;
    record: TRecord;
    match: LushaRecord;
    enrichedAt: string;
    companyIdByDomain: Map<string, Promise<string | undefined>>;
  }) => Promise<Record<string, unknown>>;
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

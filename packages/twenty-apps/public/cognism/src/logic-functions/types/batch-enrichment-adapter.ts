import { type CoreApiClient } from 'twenty-client-sdk/core';

import { type BulkEnrichInput } from 'src/logic-functions/types/bulk-enrich-input';
import { type CompanyIdByMatchKeyCache } from 'src/logic-functions/types/company-id-by-match-key-cache';
import { type CognismEnrichResult } from 'src/logic-functions/types/cognism-enrich-result';

export type BatchEnrichmentAdapter<
  TNode extends { id: string },
  TData,
  TParams,
> = {
  objectNameSingular: string;
  noIdentifierMessage: string;
  costPerRedeemDollars: number;
  readRecords: (args: {
    client: CoreApiClient;
    recordIds: string[];
  }) => Promise<TNode[]>;
  extractParams: (args: {
    node: TNode;
    input: BulkEnrichInput;
  }) => TParams | undefined;
  enrichBatch: (params: TParams[]) => Promise<CognismEnrichResult<TData>[]>;
  buildMatchedData: (args: {
    client: CoreApiClient;
    node: TNode;
    outcome: { matchScore?: number; data: TData };
    enrichedAt: string;
    companyIdByMatchKeyCache: CompanyIdByMatchKeyCache;
    overrideExistingValues: boolean;
    shouldPersist: boolean;
  }) => Promise<{
    mappedData: Record<string, unknown>;
    persistData: Record<string, unknown>;
  }>;
  updateOne: (args: {
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

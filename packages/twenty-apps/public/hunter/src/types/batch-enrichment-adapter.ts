import { type CoreApiClient } from 'twenty-client-sdk/core';

import { type CompanyIdByMatchKeyCache } from 'src/types/company-id-by-match-key-cache';
import { type HunterEnrichResult } from 'src/types/hunter-enrich-result';

export type BatchEnrichmentAdapter<TNode, TData, TParams> = {
  objectNameSingular: string;
  noIdentifierMessage: string;
  readRecords: (args: {
    client: CoreApiClient;
    recordIds: string[];
  }) => Promise<TNode[]>;
  getNodeId: (node: TNode) => string;
  extractParams: (args: { node: TNode }) => TParams | undefined;
  enrichBatch: (
    params: TParams[],
    options: { deadline: number },
  ) => Promise<HunterEnrichResult<TData>[]>;
  buildMatchedData: (args: {
    client: CoreApiClient;
    node: TNode;
    outcome: { data: TData };
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

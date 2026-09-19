import { type CoreApiClient } from 'twenty-client-sdk/core';

import { type BulkEnrichInput } from 'src/types/bulk-enrich-input';
import { type CompanyIdByMatchKeyCache } from 'src/types/company-id-by-match-key-cache';
import { type ZoomInfoEnrichResult } from 'src/types/zoominfo-enrich-result';

export type BatchEnrichmentAdapter<TNode, TData, TInput> = {
  objectNameSingular: string;
  noIdentifierMessage: string;
  readRecords: (args: {
    client: CoreApiClient;
    recordIds: string[];
  }) => Promise<TNode[]>;
  getNodeId: (node: TNode) => string;
  extractMatchInput: (args: {
    node: TNode;
    input: BulkEnrichInput;
  }) => TInput | undefined;
  enrichBatch: (matchInputs: TInput[]) => Promise<ZoomInfoEnrichResult<TData>[]>;
  // Resolves the whole chunk's related records up front so buildMatchedData
  // does not query per record.
  preloadMatchedRelations?: (args: {
    client: CoreApiClient;
    matchedData: TData[];
    companyIdByMatchKeyCache: CompanyIdByMatchKeyCache;
  }) => Promise<void>;
  buildMatchedData: (args: {
    client: CoreApiClient;
    node: TNode;
    outcome: { matchStatus: string; data: TData };
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

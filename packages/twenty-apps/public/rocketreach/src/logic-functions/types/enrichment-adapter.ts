import { type CoreApiClient } from 'twenty-client-sdk/core';

import { type BulkEnrichInput } from 'src/types/bulk-enrich-input';
import { type CompanyIdByMatchKeyCache } from 'src/types/company-id-by-match-key-cache';
import { type RevealSettings } from 'src/types/reveal-settings';
import { type RocketReachLookupResult } from 'src/types/rocketreach-lookup-result';

export type EnrichmentAdapter<TNode, TData, TParams> = {
  objectNameSingular: string;
  noIdentifierMessage: string;
  countCreditsPerMatch: (revealSettings: RevealSettings) => number;
  readRecords: (args: {
    client: CoreApiClient;
    recordIds: string[];
  }) => Promise<TNode[]>;
  getNodeId: (node: TNode) => string;
  extractParams: (args: {
    node: TNode;
    input: BulkEnrichInput;
  }) => TParams | undefined;
  lookupMany: (args: {
    params: TParams[];
    revealSettings: RevealSettings;
  }) => Promise<RocketReachLookupResult<TData>[]>;
  buildMatchedData: (args: {
    client: CoreApiClient;
    node: TNode;
    data: TData;
    isPending: boolean;
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

import { type ConnectionProviderScope } from '@/application/connectionProviderScopeType';
import { type OAuthConnectionProviderConfig } from '@/application/oauthConnectionProviderConfigType';
import { type SyncableEntityOptions } from '@/application/syncableEntityOptionsType';

type BaseConnectionProviderManifest = SyncableEntityOptions & {
  name: string;
  displayName: string;
  logo?: string;
  scope?: ConnectionProviderScope;
  identifyAccountLogicFunction?: SyncableEntityOptions;
  onConnectLogicFunction?: SyncableEntityOptions;
  onDisconnectLogicFunction?: SyncableEntityOptions;
};

export type ConnectionProviderManifest = BaseConnectionProviderManifest &
  (
    | { type: 'oauth'; oauth: OAuthConnectionProviderConfig }
    | { type: 'apiKey'; oauth?: never }
  );

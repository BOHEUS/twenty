import { type ApiKeyConnectionProviderConfig } from '@/application/apiKeyConnectionProviderConfigType';
import { type OAuthConnectionProviderConfig } from '@/application/oauthConnectionProviderConfigType';
import { type SyncableEntityOptions } from '@/application/syncableEntityOptionsType';

type ConnectionProviderManifestBase = SyncableEntityOptions & {
  name: string;
  displayName: string;
  onConnectLogicFunction?: SyncableEntityOptions;
  onDisconnectLogicFunction?: SyncableEntityOptions;
  onSendMessageLogicFunction?: SyncableEntityOptions;
};

export type ConnectionProviderManifest =
  | (ConnectionProviderManifestBase & {
      type: 'oauth';
      oauth: OAuthConnectionProviderConfig;
    })
  | (ConnectionProviderManifestBase & {
      type: 'apiKey';
      apiKey: ApiKeyConnectionProviderConfig;
    });

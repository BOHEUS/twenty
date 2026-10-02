import { CLIENT_CONFIG_BOOTSTRAP_ELEMENT_ID } from 'twenty-shared/constants';

import { type ClientConfig } from 'src/engine/core-modules/client-config/client-config.entity';
import { applyBrandToFrontendHtml } from 'src/engine/core-modules/frontend/utils/apply-brand-to-frontend-html.util';

export const renderFrontendHtml = (
  template: string,
  clientConfig: ClientConfig,
): string => {
  const serializedConfig = JSON.stringify(clientConfig)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');

  return applyBrandToFrontendHtml(template, clientConfig.brand)
    .replace(
      /<!-- BEGIN: Twenty Config -->[\s\S]*?<!-- END: Twenty Config -->/,
      '<script id="twenty-env-config">window._env_ = {};</script>',
    )
    .replace(
      '</head>',
      () =>
        `<script id="${CLIENT_CONFIG_BOOTSTRAP_ELEMENT_ID}" type="application/json">${serializedConfig}</script></head>`,
    );
};

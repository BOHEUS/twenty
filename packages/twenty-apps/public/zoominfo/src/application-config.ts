import { defineApplication, FieldType } from 'twenty-sdk/define';

import { APPLICATION_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

export default defineApplication({
  universalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
  displayName: 'ZoomInfo',
  description: 'Enrich People and Companies with ZoomInfo data.',
  logo: 'public/zoominfo-logomark.svg',
  category: 'Enrichment',
  author: 'Twenty',
  websiteUrl: 'https://docs.twenty.com/developers/extend/apps/getting-started',
  issueReportUrl: 'https://github.com/twentyhq/twenty/issues',
  serverVariables: {
    ZOOMINFO_CLIENT_ID: {
      description:
        'Client ID of the ZoomInfo OAuth application, from the Developer tab of your ZoomInfo account.',
      isSecret: false,
      isRequired: true,
    },
    ZOOMINFO_CLIENT_SECRET: {
      description: 'Client secret of the ZoomInfo OAuth application.',
      isSecret: true,
      isRequired: true,
    },
    ZOOMINFO_CONTACT_MIN_ACCURACY_SCORE: {
      description:
        'Default minimum contact accuracy score (0-100) for people enrichment. Used by the command menu item and by workflow nodes that leave the minimum accuracy score empty. When unset, ZoomInfo applies no accuracy floor.',
      type: FieldType.NUMBER,
      isSecret: false,
    },
  },
});

import { t } from '@lingui/core/macro';
import { type Brand } from 'twenty-shared/types';

import { getDocumentationUrl } from '@/support/utils/getDocumentationUrl';

export const getStandardApplicationDescription = (brand: Brand): string => {
  const brandName = brand.name;
  const gettingStartedUrl = getDocumentationUrl({
    docsUrl: brand.docsUrl,
    path: '/developers/extend/apps/getting-started',
  });
  const buildingAppsUrl = getDocumentationUrl({
    docsUrl: brand.docsUrl,
    path: '/developers/extend/apps/building',
  });

  return t`The base data model every ${brandName} workspace runs on.

#### What "foundation" means

Every ${brandName} workspace starts with this set of objects. They define the shape of your CRM, including relationships, activity, and reporting. Everything else, including marketplace apps, AI agents, and custom objects, plugs into them.

#### Included objects
- **People & Companies**: contact and account records
- **Opportunities**: your sales pipeline
- **Notes & Tasks**: activity and follow-ups
- **Workflows & Dashboards**: automation and reporting

Remove this app and the rest of ${brandName} has nothing to hang off.

#### Build your own app

Extend ${brandName} with your own objects, fields, logic functions, or AI skills. Scaffold a new app in one command:

\`\`\`bash
npx create-twenty-app@latest my-twenty-app
\`\`\`

Then inside the folder:

\`\`\`bash
cd my-twenty-app
yarn twenty dev
\`\`\`

See the [Getting Started guide](${gettingStartedUrl}) for the full walkthrough, and [Building Apps](${buildingAppsUrl}) for the \`defineApplication\` / \`defineEntity\` APIs.`;
};

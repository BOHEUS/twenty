import { defineFrontComponent } from 'twenty-sdk/define';
import { Command, useSelectedRecordIds } from 'twenty-sdk/front-component';

import {
  LUSHA_FRONT_COMPONENT_UNIVERSAL_IDENTIFIERS,
  LUSHA_LOGIC_FUNCTION_ROUTE_PATHS,
} from 'src/constants/universal-identifiers';
import { callBulkEnrichment } from 'src/front-components/utils/call-bulk-enrichment';

const EnrichCompanies = () => {
  const recordIds = useSelectedRecordIds();

  return (
    <Command
      execute={() =>
        callBulkEnrichment({
          path: LUSHA_LOGIC_FUNCTION_ROUTE_PATHS.enrichCompanies,
          recordIds,
        })
      }
    />
  );
};

export default defineFrontComponent({
  universalIdentifier:
    LUSHA_FRONT_COMPONENT_UNIVERSAL_IDENTIFIERS.enrichCompanies,
  name: 'enrich-companies-effect',
  description: 'Enriches the selected Companies with Lusha data.',
  component: EnrichCompanies,
  isHeadless: true,
});

import { defineFrontComponent } from 'twenty-sdk/define';
import { Command, useSelectedRecordIds } from 'twenty-sdk/front-component';

import {
  LUSHA_FRONT_COMPONENT_UNIVERSAL_IDENTIFIERS,
  LUSHA_LOGIC_FUNCTION_ROUTE_PATHS,
} from 'src/constants/universal-identifiers';
import { callBulkEnrichment } from 'src/front-components/utils/call-bulk-enrichment';

const EnrichPeople = () => {
  const recordIds = useSelectedRecordIds();

  return (
    <Command
      execute={() =>
        callBulkEnrichment({
          path: LUSHA_LOGIC_FUNCTION_ROUTE_PATHS.enrichPeople,
          recordIds,
        })
      }
    />
  );
};

export default defineFrontComponent({
  universalIdentifier: LUSHA_FRONT_COMPONENT_UNIVERSAL_IDENTIFIERS.enrichPeople,
  name: 'enrich-people-effect',
  description: 'Enriches the selected People with Lusha data.',
  component: EnrichPeople,
  isHeadless: true,
});

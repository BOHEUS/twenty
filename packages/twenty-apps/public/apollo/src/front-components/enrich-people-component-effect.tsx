import { defineFrontComponent } from 'twenty-sdk/define';
import { Command, useSelectedRecordIds } from 'twenty-sdk/front-component';

import {
  APOLLO_FRONT_COMPONENT_UNIVERSAL_IDENTIFIERS,
  APOLLO_LOGIC_FUNCTION_ROUTE_PATHS,
} from 'src/constants/universal-identifiers';
import { callBulkEnrichment } from 'src/front-components/utils/call-bulk-enrichment';

const EnrichPeople = () => {
  const recordIds = useSelectedRecordIds();

  return (
    <Command
      execute={() =>
        callBulkEnrichment({
          path: APOLLO_LOGIC_FUNCTION_ROUTE_PATHS.enrichPeople,
          recordIds,
        })
      }
    />
  );
};

export default defineFrontComponent({
  universalIdentifier:
    APOLLO_FRONT_COMPONENT_UNIVERSAL_IDENTIFIERS.enrichPeople,
  name: 'enrich-people-effect',
  description: 'Enriches the selected People with Apollo data.',
  component: EnrichPeople,
  isHeadless: true,
});

import { defineFrontComponent } from 'twenty-sdk/define';
import { Command, useSelectedRecordIds } from 'twenty-sdk/front-component';

import { execute } from 'src/front-components/utils/call-enrich-logic-function.utils';
import {
  ROCKETREACH_FRONT_COMPONENT_UNIVERSAL_IDENTIFIERS,
  ROCKETREACH_LOGIC_FUNCTION_CONSTANTS,
} from 'src/constants/universal-identifiers';

const EnrichCompanies = () => {
  const recordIds = useSelectedRecordIds();

  return (
    <Command
      execute={() =>
        execute({
          path: ROCKETREACH_LOGIC_FUNCTION_CONSTANTS.enrichCompanies.path,
          recordIds,
        })
      }
    />
  );
};

export default defineFrontComponent({
  universalIdentifier:
    ROCKETREACH_FRONT_COMPONENT_UNIVERSAL_IDENTIFIERS.enrichCompanies,
  name: 'enrich-companies-effect',
  description: 'Enrich companies effect',
  component: EnrichCompanies,
  isHeadless: true,
});

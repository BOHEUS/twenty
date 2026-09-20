import { defineFrontComponent } from 'twenty-sdk/define';
import { Command, useSelectedRecordIds } from 'twenty-sdk/front-component';

import { execute } from 'src/front-components/utils/call-enrich-logic-function.utils';
import {
  ROCKETREACH_FRONT_COMPONENT_UNIVERSAL_IDENTIFIERS,
  ROCKETREACH_LOGIC_FUNCTION_CONSTANTS,
} from 'src/constants/universal-identifiers';

const EnrichPeople = () => {
  const recordIds = useSelectedRecordIds();

  return (
    <Command
      execute={() =>
        execute({
          path: ROCKETREACH_LOGIC_FUNCTION_CONSTANTS.enrichPeople.path,
          recordIds,
        })
      }
    />
  );
};

export default defineFrontComponent({
  universalIdentifier:
    ROCKETREACH_FRONT_COMPONENT_UNIVERSAL_IDENTIFIERS.enrichPeople,
  name: 'enrich-people-effect',
  description: 'Enrich people effect',
  component: EnrichPeople,
  isHeadless: true,
});

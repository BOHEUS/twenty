import { defineFrontComponent } from 'twenty-sdk/define';
import { Command, useSelectedRecordIds } from 'twenty-sdk/front-component';
import {
  HUNTER_FRONT_COMPONENT_UNIVERSAL_IDENTIFIERS,
  HUNTER_LOGIC_FUNCTION_CONSTANTS,
} from 'src/constants/universal-identifiers';
import { execute } from 'src/front-components/utils/call-enrich-logic-function.utils';

const Enrich = () => {
  const recordIds = useSelectedRecordIds();
  return (
    <Command
      execute={() =>
        execute({
          path: HUNTER_LOGIC_FUNCTION_CONSTANTS.enrichPeople.path,
          recordIds,
        })
      }
    />
  );
};

export default defineFrontComponent({
  universalIdentifier:
    HUNTER_FRONT_COMPONENT_UNIVERSAL_IDENTIFIERS.enrichPeople,
  name: 'enrich-people-effect',
  description: 'Enrich people effect',
  component: Enrich,
  isHeadless: true,
});

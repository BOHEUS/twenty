import { defineFrontComponent } from 'twenty-sdk/define';
import { Command, useSelectedRecordIds } from 'twenty-sdk/front-component';

import { execute } from 'src/front-components/utils/call-enrich-logic-function.util';
import {
  ENRICH_FUNCTION_PATH,
  MAIN_PAGE_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

const Enrich = () => {
  const recordIds = useSelectedRecordIds();

  return (
    <Command
      execute={() => execute({ path: ENRICH_FUNCTION_PATH, recordIds })}
    />
  );
};

export default defineFrontComponent({
  universalIdentifier: MAIN_PAGE_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  name: 'enrich-people-effect',
  description:
    'Sends the people selected in the command menu to the enrich logic function',
  component: Enrich,
  isHeadless: true,
});

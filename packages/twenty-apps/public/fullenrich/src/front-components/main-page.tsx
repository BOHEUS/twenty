import { defineFrontComponent } from 'twenty-sdk/define';

import {
  APP_DISPLAY_NAME, ENRICH_FUNCTION_PATH,
  MAIN_PAGE_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';
import { Command, useSelectedRecordIds } from "twenty-sdk/front-component";
import { execute } from "src/logic-functions/utils/execute.util";

const Enrich = () => {
  const recordIds = useSelectedRecordIds();
  return <Command execute={() => execute({ path: ENRICH_FUNCTION_PATH, recordIds })} />;
};

export default defineFrontComponent({
  universalIdentifier: MAIN_PAGE_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  name: APP_DISPLAY_NAME,
  description: `${APP_DISPLAY_NAME} front component displaying the app logo and name`,
  component: Enrich,
});

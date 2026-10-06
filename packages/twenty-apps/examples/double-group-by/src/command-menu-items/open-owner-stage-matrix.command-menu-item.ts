import { defineCommandMenuItem } from 'twenty-sdk/define';
import { OWNER_STAGE_MATRIX_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER } from '../components/owner-stage-matrix.front-component';

export default defineCommandMenuItem({
  universalIdentifier: '4ee21891-18b6-4b99-8530-d192e5e4ffce',
  label: 'Opportunities by owner and stage',
  shortLabel: 'Owner x stage',
  icon: 'IconChartBar',
  isPinned: true,
  availabilityType: 'GLOBAL',
  frontComponentUniversalIdentifier:
    OWNER_STAGE_MATRIX_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
});

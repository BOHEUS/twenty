import { defineFrontComponent } from 'twenty-sdk/define';

import { COMPANY_POWER_MAP_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';
import { RelationshipMap } from 'src/front-components/components/RelationshipMap';

const CompanyPowerMap = () => <RelationshipMap scope="company" />;

export default defineFrontComponent({
  universalIdentifier: COMPANY_POWER_MAP_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  name: 'company-power-map',
  description:
    "Graph of a company's people and the relationships they have, inside and outside the company",
  component: CompanyPowerMap,
});

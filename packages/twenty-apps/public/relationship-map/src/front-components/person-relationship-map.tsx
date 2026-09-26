import { defineFrontComponent } from 'twenty-sdk/define';

import { PERSON_RELATIONSHIP_MAP_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';
import { RelationshipMap } from 'src/front-components/components/RelationshipMap';

const PersonRelationshipMap = () => <RelationshipMap scope="person" />;

export default defineFrontComponent({
  universalIdentifier:
    PERSON_RELATIONSHIP_MAP_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  name: 'person-relationship-map',
  description: 'Graph of the people a person is directly connected to',
  component: PersonRelationshipMap,
});

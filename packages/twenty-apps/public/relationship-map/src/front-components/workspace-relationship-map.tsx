import { defineFrontComponent } from 'twenty-sdk/define';

import { WORKSPACE_RELATIONSHIP_MAP_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';
import { RelationshipMap } from 'src/front-components/components/RelationshipMap';

const WorkspaceRelationshipMap = () => <RelationshipMap scope="workspace" />;

export default defineFrontComponent({
  universalIdentifier:
    WORKSPACE_RELATIONSHIP_MAP_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  name: 'workspace-relationship-map',
  description: 'Graph of every relationship between people in the workspace',
  component: WorkspaceRelationshipMap,
});

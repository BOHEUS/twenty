import { defineFrontComponent } from 'twenty-sdk/define';
import { Command } from 'twenty-sdk/front-component';
import { execute } from "src/front-components/util";

// React component - implement your UI here
const Component = () => {
  return <Command execute={() => execute({path: '/list-test1-records'})}/>
};

export default defineFrontComponent({
  universalIdentifier: 'b7b09938-022b-4eb7-afed-50d43efae8db',
  name: 'a',
  description: 'Add a description for your front component',
  component: Component,
});

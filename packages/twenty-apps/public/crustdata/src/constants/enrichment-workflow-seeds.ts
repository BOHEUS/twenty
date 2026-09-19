import { CRUSTDATA_LOGIC_FUNCTION_CONSTANTS } from 'src/constants/universal-identifiers';
import { type EnrichmentWorkflowSeed } from 'src/types/enrichment-workflow-seed';

const ENRICHMENT_ICON = 'IconSparkles';

export const ENRICHMENT_WORKFLOW_SEEDS: EnrichmentWorkflowSeed[] = [
  {
    objectNameSingular: 'company',
    workflowName: 'Enrich companies with Crustdata',
    triggerName: 'When companies are selected',
    icon: ENRICHMENT_ICON,
    stepName: 'Enrich Companies',
    logicFunctionUniversalIdentifier:
      CRUSTDATA_LOGIC_FUNCTION_CONSTANTS.enrichCompanies.universalIdentifier,
    logicFunctionInput: { records: '{{trigger.companies}}' },
  },
  {
    objectNameSingular: 'person',
    workflowName: 'Enrich people with Crustdata',
    triggerName: 'When people are selected',
    icon: ENRICHMENT_ICON,
    stepName: 'Enrich People',
    logicFunctionUniversalIdentifier:
      CRUSTDATA_LOGIC_FUNCTION_CONSTANTS.enrichPeople.universalIdentifier,
    logicFunctionInput: { records: '{{trigger.people}}' },
  },
];

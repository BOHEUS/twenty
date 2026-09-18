import { CoreApiClient } from 'twenty-client-sdk/core';
import { MetadataApiClient } from 'twenty-client-sdk/metadata';

import { ENRICHMENT_WORKFLOW_SEEDS } from 'src/constants/enrichment-workflow-seeds';
import { resolveLogicFunctionId } from 'src/logic-functions/utils/resolve-logic-function-id';
import { seedEnrichmentWorkflow } from 'src/logic-functions/utils/seed-enrichment-workflow';
import { type PostInstallResult } from 'src/logic-functions/types/post-install-result';
import { type SeedEnrichmentWorkflowResult } from 'src/logic-functions/types/seed-enrichment-workflow-result';
import { isDefined } from 'src/logic-functions/data/is-defined';
import { toErrorMessage } from 'src/logic-functions/data/to-error-message';

export const postInstallCore = async ({
  coreClient = new CoreApiClient(),
  metadataClient = new MetadataApiClient(),
}: {
  coreClient?: CoreApiClient;
  metadataClient?: MetadataApiClient;
} = {}): Promise<PostInstallResult> => {
  const { findManyLogicFunctions: logicFunctions } = await metadataClient.query(
    {
      findManyLogicFunctions: {
        id: true,
        universalIdentifier: true,
      },
    },
  );

  const seededWorkflows: SeedEnrichmentWorkflowResult[] = [];

  for (const seed of ENRICHMENT_WORKFLOW_SEEDS) {
    const logicFunctionId = resolveLogicFunctionId({
      logicFunctions,
      universalIdentifier: seed.logicFunctionUniversalIdentifier,
    });

    if (!isDefined(logicFunctionId)) {
      console.warn(
        `[cognism] Skipping "${seed.workflowName}": logic function ${seed.logicFunctionUniversalIdentifier} is not installed.`,
      );
      continue;
    }

    try {
      const result = await seedEnrichmentWorkflow({
        client: coreClient,
        logicFunctionId,
        seed,
      });

      seededWorkflows.push(result);
    } catch (error) {
      const errorMessage = toErrorMessage(error);

      console.warn(
        `[cognism] Failed to seed "${seed.workflowName}": ${errorMessage}`,
        error,
      );

      seededWorkflows.push({
        objectNameSingular: seed.objectNameSingular,
        workflowName: seed.workflowName,
        status: 'failed',
        error: errorMessage,
      });
    }
  }

  return { seededWorkflows };
};

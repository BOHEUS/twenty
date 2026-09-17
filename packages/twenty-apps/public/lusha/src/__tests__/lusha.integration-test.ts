import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { CoreApiClient } from 'twenty-client-sdk/core';
import { MetadataApiClient } from 'twenty-client-sdk/metadata';
import { functionExecute } from 'twenty-sdk/cli';
import { describe, expect, it } from 'vitest';

import { LUSHA_API_KEY_MISSING_MESSAGE } from 'src/constants/enrichment-messages.constant';
import {
  APPLICATION_UNIVERSAL_IDENTIFIER,
  LUSHA_LOGIC_FUNCTION_ROUTE_PATHS,
} from 'src/constants/universal-identifiers';

const APP_PATH = process.cwd();

describe('Lusha app', () => {
  it('should be installed', async () => {
    const result = await new MetadataApiClient().query({
      findManyApplications: { universalIdentifier: true },
    });

    expect(
      result.findManyApplications.map(
        (application: { universalIdentifier: string }) =>
          application.universalIdentifier,
      ),
    ).toContain(APPLICATION_UNIVERSAL_IDENTIFIER);
  });

  it('should deploy every logic function of the built application', async () => {
    const manifest = JSON.parse(
      readFileSync(
        join(APP_PATH, '.twenty', 'output', 'manifest.json'),
        'utf8',
      ),
    ) as { logicFunctions: { name: string }[] };

    const result = await new MetadataApiClient().query({
      findManyLogicFunctions: { name: true },
    });
    const deployedNames = result.findManyLogicFunctions.map(
      (logicFunction: { name: string }) => logicFunction.name,
    );

    for (const { name } of manifest.logicFunctions) {
      expect(deployedNames).toContain(name);
    }
  });

  it('should report the missing API key without touching the people it was given', async () => {
    const client = new CoreApiClient();
    const { createPerson } = await client.mutation({
      createPerson: {
        __args: {
          data: { name: { firstName: 'Lusha', lastName: 'Integration' } },
        },
        id: true,
      },
    });
    const personId = createPerson?.id;

    if (!personId) {
      throw new Error('The test person could not be created.');
    }

    try {
      const execution = await functionExecute({
        appPath: APP_PATH,
        functionName: 'enrich-people',
        payload: {
          headers: {},
          queryStringParameters: {},
          pathParameters: {},
          body: { recordIds: [personId] },
          isBase64Encoded: false,
          requestContext: {
            http: {
              method: 'POST',
              path: LUSHA_LOGIC_FUNCTION_ROUTE_PATHS.enrichPeople,
            },
          },
        },
      });

      if (!execution.success) {
        throw new Error(execution.error.message);
      }

      expect(execution.data.status).toBe('SUCCESS');
      expect(execution.data.data).toMatchObject({
        success: false,
        total: 1,
        errored: 1,
        results: [
          { recordId: personId, message: LUSHA_API_KEY_MISSING_MESSAGE },
        ],
      });

      const { person } = await client.query({
        person: {
          __args: { filter: { id: { eq: personId } } },
          lushaEnrichmentStatus: true,
        },
      });

      expect(person?.lushaEnrichmentStatus).toBeNull();
    } finally {
      await client.mutation({
        destroyPerson: { __args: { id: personId }, id: true },
      });
    }
  });
});

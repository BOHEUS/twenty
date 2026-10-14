import { CoreApiClient } from 'twenty-client-sdk/core';
import { defineLogicFunction } from 'twenty-sdk/define';

import { LIST_TEST1_RECORDS_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

const handler = async () => {
  const client = new CoreApiClient();

  const test11 = await client.query({
    test11: {
      edges: {
        node: {
          id: true,
          name: true,
        },
      },
    },
  });

  await client.mutation({
    createTest1: {
      __args: {
        data: {
          name: 'test1',
        }
      }
    }
  });

  await client.mutation({
    createCompany: {
      __args: {
        data: {
          name: 'test2',
          test1: 'test1'
        }
      }
    }
  })
};

export default defineLogicFunction({
  universalIdentifier: LIST_TEST1_RECORDS_UNIVERSAL_IDENTIFIER,
  name: 'list-test1-records',
  description: 'Lists the records of the Test 1 object owned by the Test 1 app',
  timeoutSeconds: 10,
  handler,
  httpRouteTriggerSettings: {
    path: '/list-test1-records',
    httpMethod: 'GET',
    isAuthRequired: false,
  },
});

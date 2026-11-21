import { isNull } from '@sniptt/guards';
import {
  findConnectionForRequest,
  listConnections,
  type AppConnection,
  type LogicFunctionExecutionContext,
} from 'twenty-sdk/logic-function';

import { APOLLO_CONNECTION_PROVIDER_NAME } from 'src/constants/universal-identifiers';

type ApolloConnection = AppConnection & { accessToken: string };

export const findApolloConnection = async (
  context: Pick<LogicFunctionExecutionContext, 'userWorkspaceId'>,
): Promise<ApolloConnection | null> => {
  const connection = findConnectionForRequest(
    await listConnections({ providerName: APOLLO_CONNECTION_PROVIDER_NAME }),
    context,
  );

  if (isNull(connection) || isNull(connection.accessToken)) {
    return null;
  }

  return { ...connection, accessToken: connection.accessToken };
};

import {
  findConnectionForRequest,
  listConnections,
  type AppConnection,
  type LogicFunctionExecutionContext,
} from 'twenty-sdk/logic-function';

import { APOLLO_CONNECTION_PROVIDER_NAME } from 'src/constants/universal-identifiers';

export const findApolloConnection = async (
  context: Pick<LogicFunctionExecutionContext, 'userWorkspaceId'>,
): Promise<AppConnection | null> =>
  findConnectionForRequest(
    await listConnections({ providerName: APOLLO_CONNECTION_PROVIDER_NAME }),
    context,
  );

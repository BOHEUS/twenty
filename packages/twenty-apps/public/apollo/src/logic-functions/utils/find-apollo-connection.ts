import {
  findConnectionForRequest,
  listConnections,
  type AppConnection,
  type LogicFunctionExecutionContext,
} from 'twenty-sdk/logic-function';

import { APOLLO_CONNECTION_PROVIDER_NAME } from 'src/constants/universal-identifiers';

// A person enriching from a record selection spends their own Apollo credits;
// a workflow, a database event or an agent has nobody behind it and falls back
// to the connection shared with the workspace.
export const findApolloConnection = async (
  context: Pick<LogicFunctionExecutionContext, 'userWorkspaceId'>,
): Promise<AppConnection | null> =>
  findConnectionForRequest(
    await listConnections({ providerName: APOLLO_CONNECTION_PROVIDER_NAME }),
    context,
  );

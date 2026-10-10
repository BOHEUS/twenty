import { defineLogicFunction, type RoutePayload } from 'twenty-sdk/define';
import { Response } from 'twenty-sdk/logic-function';
import { clearMigrationState } from 'src/logic-functions/utils/migration-state.util';
import { isRunLockActive } from 'src/logic-functions/utils/run-lock.util';
import { MIGRATION_RESET_ROUTE_PATH } from 'src/constants/migration-reset-route-path';
import { MIGRATION_RESET_ROUTE_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

const jsonResponse = (status: number, body: unknown): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const handler = async (_event: RoutePayload): Promise<Response> => {
  if (await isRunLockActive()) {
    return jsonResponse(409, { error: 'A migration is running - wait for it to stop before resetting' });
  }
  await clearMigrationState();
  return jsonResponse(200, { reset: true });
};

export default defineLogicFunction({
  universalIdentifier: MIGRATION_RESET_ROUTE_UNIVERSAL_IDENTIFIER,
  name: 'migration-reset-route',
  description: 'Clears the saved migration progress so the next run starts over from stage 1.',
  timeoutSeconds: 60,
  handler,
  httpRouteTriggerSettings: {
    path: MIGRATION_RESET_ROUTE_PATH,
    httpMethod: 'POST',
    isAuthRequired: true,
  },
});

import { postToOwnRoute } from "src/logic-functions/requests/post-to-own-route.util";
import { getCurrentRunId, markRunHandedOff } from "src/logic-functions/utils/run-lock.util";

export const triggerWorkspaceMigration = async () => {
  const continueMigration = await postToOwnRoute({ runId: getCurrentRunId() });

  if (!continueMigration) {
    throw new Error(
      `Failed to continue migration`,
    );
  }
  markRunHandedOff();
};
// Serializes the lifecycle operations of a workspace that read or change state
// shared between applications. Always taken inside the per-application lock,
// so a holder never waits on another lock.
export const buildApplicationDependencyLockKey = ({
  workspaceId,
}: {
  workspaceId: string;
}): string => `application-dependency:${workspaceId}`;

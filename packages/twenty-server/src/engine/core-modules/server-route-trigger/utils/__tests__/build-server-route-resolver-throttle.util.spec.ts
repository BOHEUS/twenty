import { buildWorkspaceLogicFunctionExecutionThrottle } from 'src/engine/core-modules/logic-function/logic-function-executor/utils/build-workspace-logic-function-execution-throttle.util';
import { buildServerRouteResolverThrottle } from 'src/engine/core-modules/server-route-trigger/utils/build-server-route-resolver-throttle.util';

describe('buildServerRouteResolverThrottle', () => {
  it('scopes the bucket to the application registration', () => {
    expect(
      buildServerRouteResolverThrottle({
        applicationRegistrationId: 'registration-1',
        maxTokens: 5000,
        windowMs: 60_000,
      }),
    ).toEqual({
      key: 'registration-1-server-route-resolver',
      maxTokens: 5000,
      windowMs: 60_000,
    });
  });

  it('never shares a key with the owner workspace execution bucket', () => {
    const sharedId = 'same-id';

    const resolverThrottle = buildServerRouteResolverThrottle({
      applicationRegistrationId: sharedId,
      maxTokens: 1,
      windowMs: 1,
    });
    const workspaceThrottle = buildWorkspaceLogicFunctionExecutionThrottle({
      workspaceId: sharedId,
      maxTokens: 1,
      windowMs: 1,
    });

    expect(resolverThrottle.key).not.toBe(workspaceThrottle.key);
  });
});

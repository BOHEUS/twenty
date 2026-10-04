import { type LogicFunctionExecutionThrottle } from 'src/engine/core-modules/logic-function/logic-function-executor/types/logic-function-execution-throttle.type';

// Resolvers run in the app owner's workspace for every tenant's webhooks,
// so they get a bucket per application registration instead of sharing
// the owner's workspace bucket with its own logic functions.
export const buildServerRouteResolverThrottle = ({
  applicationRegistrationId,
  maxTokens,
  windowMs,
}: {
  applicationRegistrationId: string;
  maxTokens: number;
  windowMs: number;
}): LogicFunctionExecutionThrottle => ({
  key: `${applicationRegistrationId}-server-route-resolver`,
  maxTokens,
  windowMs,
});

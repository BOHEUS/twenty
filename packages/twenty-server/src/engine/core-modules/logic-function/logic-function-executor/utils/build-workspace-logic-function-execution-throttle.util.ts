import { type LogicFunctionExecutionThrottle } from 'src/engine/core-modules/logic-function/logic-function-executor/types/logic-function-execution-throttle.type';

export const buildWorkspaceLogicFunctionExecutionThrottle = ({
  workspaceId,
  maxTokens,
  windowMs,
}: {
  workspaceId: string;
  maxTokens: number;
  windowMs: number;
}): LogicFunctionExecutionThrottle => ({
  key: `${workspaceId}-logic-function-execution`,
  maxTokens,
  windowMs,
});

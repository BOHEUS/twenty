import {
  WorkspaceMigrationActionExecutionException,
  WorkspaceMigrationActionExecutionExceptionCode,
} from 'src/engine/workspace-manager/workspace-migration/workspace-migration-runner/exceptions/workspace-migration-action-execution.exception';

const POSTGRES_MAX_COLUMNS_PER_TABLE = 1600;

export const assertColumnLimitNotExceededOrThrow = ({
  existingColumnSlotCount,
  addedColumnCount,
}: {
  existingColumnSlotCount: number;
  addedColumnCount: number;
}): void => {
  const totalColumnSlotCount = existingColumnSlotCount + addedColumnCount;

  if (totalColumnSlotCount > POSTGRES_MAX_COLUMNS_PER_TABLE) {
    throw new WorkspaceMigrationActionExecutionException({
      message: `Table would have ${totalColumnSlotCount} columns, the Postgres maximum is ${POSTGRES_MAX_COLUMNS_PER_TABLE}`,
      code: WorkspaceMigrationActionExecutionExceptionCode.COLUMN_LIMIT_REACHED,
    });
  }
};

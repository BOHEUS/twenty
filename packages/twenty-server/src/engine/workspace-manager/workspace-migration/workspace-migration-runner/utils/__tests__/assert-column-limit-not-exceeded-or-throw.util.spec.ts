import { assertColumnLimitNotExceededOrThrow } from 'src/engine/workspace-manager/workspace-migration/workspace-migration-runner/utils/assert-column-limit-not-exceeded-or-throw.util';

describe('assertColumnLimitNotExceededOrThrow', () => {
  it('should accept columns that reach the limit exactly', () => {
    expect(() =>
      assertColumnLimitNotExceededOrThrow({
        existingColumnSlotCount: 1598,
        addedColumnCount: 2,
      }),
    ).not.toThrow();
  });

  it('should throw when columns exceed the limit', () => {
    expect(() =>
      assertColumnLimitNotExceededOrThrow({
        existingColumnSlotCount: 1599,
        addedColumnCount: 2,
      }),
    ).toThrow(
      expect.objectContaining({
        code: 'COLUMN_LIMIT_REACHED',
      }),
    );
  });
});

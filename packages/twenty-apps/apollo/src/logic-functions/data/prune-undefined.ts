import { isDefined } from "./is-defined";

export const pruneUndefined = (
  record: Record<string, unknown>,
): Record<string, unknown> =>
  Object.fromEntries(
    Object.entries(record).filter(([, value]) => isDefined(value)),
  );

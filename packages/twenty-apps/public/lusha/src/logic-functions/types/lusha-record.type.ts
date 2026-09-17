// Lusha answers with loosely typed JSON, so values are read through the
// converters in src/logic-functions/data rather than trusted as typed.
export type LushaRecord = Record<string, unknown>;

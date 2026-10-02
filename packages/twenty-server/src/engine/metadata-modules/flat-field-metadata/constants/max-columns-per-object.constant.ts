// Postgres allows 1600 columns per table; keep headroom for dropped columns that still count
export const MAX_COLUMNS_PER_OBJECT = 1500;

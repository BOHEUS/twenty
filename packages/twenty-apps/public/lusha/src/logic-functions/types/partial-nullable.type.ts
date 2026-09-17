// Records read back from the API may miss or null out any composite subfield.
export type PartialNullable<TValue> = {
  [Key in keyof TValue]?: TValue[Key] | null;
};

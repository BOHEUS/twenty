export type LushaApiKey = {
  value: string;
  // The instance-wide key spends the Lusha credits of the instance operator,
  // so those are the runs the workspace is charged for.
  isBillable: boolean;
};

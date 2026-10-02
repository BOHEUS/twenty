export type RichTextValueMapping = (value: unknown) => {
  value: unknown;
  hasChanged: boolean;
};

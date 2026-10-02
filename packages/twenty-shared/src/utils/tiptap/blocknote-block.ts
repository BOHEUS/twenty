export type BlockNoteBlock = {
  type: string;
  props: Record<string, unknown>;
  content?: unknown;
  children: BlockNoteBlock[];
};

export type Activity = {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  bodyV2?: {
    markdown: string | null;
    tiptap?: string | null;
  };
};

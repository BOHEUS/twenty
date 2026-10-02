import { type UploadedImage } from '@/advanced-text-editor/types/UploadedImage';
import { type MentionSearchResult } from '@/mention/types/MentionSearchResult';

export type AdvancedTextEditorExtensionContext = {
  onImageUpload?: (file: File) => Promise<UploadedImage>;
  onImageUploadError?: (error: Error, file: File) => void;
  searchMentionRecords?: (query: string) => Promise<MentionSearchResult[]>;
};

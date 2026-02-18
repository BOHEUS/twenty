export enum RecordExportStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export type RecordExportJobData = {
  workspaceId: string;
  exportId: string;
  objectNameSingular: string;
  filter?: Record<string, any>;
  orderBy?: Record<string, any>;
  fieldNames?: string[];
};

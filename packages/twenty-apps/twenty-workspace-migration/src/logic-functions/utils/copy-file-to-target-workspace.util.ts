import axios, { type AxiosInstance } from "axios";
import { createFileUpload } from "src/logic-functions/requests/create-file-upload.util";
import { completeFileUpload } from "src/logic-functions/requests/complete-file-upload.util";
import { executeWithRetryAndCheckpoint } from "src/logic-functions/utils/execute-with-retry-and-checkpoint.util";

export type SourceFile = {
  fileId: string;
  label: string;
  extension: string | null;
  url: string;
};

export const SOURCE_FILE_SELECTION_SET = '{ fileId label extension url }';

// Files are stored workspace-scoped server-side, so a source fileId points at nothing in the
// target: the bytes are re-uploaded against the target's own FILES field and the new fileId is
// what the record has to reference.
export const copyFileToTargetWorkspace = async (
  targetWorkspace: AxiosInstance,
  sourceFile: SourceFile,
  targetFieldMetadataId: string,
): Promise<{ fileId: string; label: string }> => {
  const filename = sourceFile.extension ? `${sourceFile.label}.${sourceFile.extension}` : sourceFile.label;
  const fileBytes = (await executeWithRetryAndCheckpoint(() =>
    axios.get<ArrayBuffer>(sourceFile.url, { responseType: 'arraybuffer' }),
  )).data;

  const uploadTarget = await executeWithRetryAndCheckpoint(() =>
    createFileUpload(targetWorkspace, filename, fileBytes.byteLength, targetFieldMetadataId),
  );

  await executeWithRetryAndCheckpoint(() =>
    axios.put(uploadTarget.uploadUrl, fileBytes, { headers: { 'Content-Type': uploadTarget.contentType } }),
  );

  await executeWithRetryAndCheckpoint(() => completeFileUpload(targetWorkspace, uploadTarget.fileId));

  return { fileId: uploadTarget.fileId, label: sourceFile.label };
};

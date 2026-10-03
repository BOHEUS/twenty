import { type CoreApiClient } from 'twenty-client-sdk/core';
import { MetadataApiClient } from 'twenty-client-sdk/metadata';
import { STANDARD_OBJECT_FIELDS } from 'twenty-shared/metadata';

type UploadFileParams = {
  fileBuffer: Buffer;
  filename: string;
  mimeType: string;
  target: { targetPersonId: string } | { targetCompanyId: string } | { targetOpportunityId: string };
};

export const uploadFile = async (
  coreClient: CoreApiClient,
  { fileBuffer, filename, target }: UploadFileParams,
) => {
  const metadataClient = new MetadataApiClient();
  const uploadedFile = await metadataClient.uploadFile({
    fileBuffer,
    filename,
    fieldMetadataUniversalIdentifier: STANDARD_OBJECT_FIELDS.attachment.file.universalIdentifier}
  );

  await coreClient.mutation({
    createAttachment: {
      __args: {
        data: {
          name: filename,
          file: [{ fileId: uploadedFile.id, label: filename }],
          ...target,
        },
      },
      id: true,
    },
  });
};

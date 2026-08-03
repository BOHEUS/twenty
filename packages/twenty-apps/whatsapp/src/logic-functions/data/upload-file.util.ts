import { MetadataApiClient } from 'twenty-client-sdk/metadata';
import { CoreApiClient } from 'twenty-client-sdk/core';
import { STANDARD_OBJECT_FIELDS } from 'twenty-shared/metadata';
import * as fs from 'fs';

const metadataClient = new MetadataApiClient();
const coreClient = new CoreApiClient();

const fileBuffer = fs.readFileSync('./invoice.pdf');

const uploadedFile = await metadataClient.uploadFile(
  fileBuffer,
  'invoice.pdf',
  'application/pdf',
  STANDARD_OBJECT_FIELDS.attachment.file.universalIdentifier,
);

await coreClient.mutation({
  createAttachment: {
    __args: {
      data: {
        name: 'invoice.pdf',
        file: [{ fileId: uploadedFile.id, label: 'invoice.pdf'
        }],
        targetPersonId: personRecordId, // or targetCompanyId /
        targetOpportunityId / etc.
    },
  },
  id: true,
},
});
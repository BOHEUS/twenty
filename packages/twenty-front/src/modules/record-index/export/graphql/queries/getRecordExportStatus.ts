import { gql } from '@apollo/client';

export const GET_RECORD_EXPORT_STATUS = gql`
  query RecordExportStatus($exportId: String!) {
    recordExportStatus(exportId: $exportId) {
      id
      objectNameSingular
      status
      downloadUrl
      errorMessage
      totalRecordCount
      processedRecordCount
      createdAt
      updatedAt
    }
  }
`;

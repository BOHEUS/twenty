import { useMutation, useLazyQuery } from '@apollo/client';
import { useCallback, useEffect, useRef, useState } from 'react';

import { CREATE_RECORD_EXPORT } from '@/object-record/record-index/export/graphql/mutations/createRecordExport';
import { GET_RECORD_EXPORT_STATUS } from '@/object-record/record-index/export/graphql/queries/getRecordExportStatus';
import { isDefined } from 'twenty-shared/utils';

type RecordExportStatus = 'pending' | 'processing' | 'completed' | 'failed';

type ExportProgress = {
  status: RecordExportStatus;
  processedRecordCount: number;
  totalRecordCount: number;
  downloadUrl?: string;
  errorMessage?: string;
};

const POLL_INTERVAL_MS = 2000;

export const useBackendRecordExport = ({
  objectNameSingular,
}: {
  objectNameSingular: string;
}) => {
  const [exportProgress, setExportProgress] = useState<ExportProgress | null>(
    null,
  );
  const [isExporting, setIsExporting] = useState(false);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [createRecordExportMutation] = useMutation(CREATE_RECORD_EXPORT);
  const [fetchExportStatus] = useLazyQuery(GET_RECORD_EXPORT_STATUS, {
    fetchPolicy: 'network-only',
  });

  const stopPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }, []);

  const startPolling = useCallback(
    (exportId: string) => {
      stopPolling();

      pollIntervalRef.current = setInterval(async () => {
        const { data } = await fetchExportStatus({
          variables: { exportId },
        });

        const exportStatus = data?.recordExportStatus;

        if (!exportStatus) {
          return;
        }

        setExportProgress({
          status: exportStatus.status,
          processedRecordCount: exportStatus.processedRecordCount,
          totalRecordCount: exportStatus.totalRecordCount,
          downloadUrl: exportStatus.downloadUrl,
          errorMessage: exportStatus.errorMessage,
        });

        if (
          exportStatus.status === 'completed' ||
          exportStatus.status === 'failed'
        ) {
          stopPolling();
          setIsExporting(false);

          if (exportStatus.status === 'completed' && exportStatus.downloadUrl) {
            // Trigger file download via the server's file endpoint
            window.open(`/api/files/${exportStatus.downloadUrl}`, '_blank');
          }
        }
      }, POLL_INTERVAL_MS);
    },
    [fetchExportStatus, stopPolling],
  );

  const triggerExport = useCallback(
    async (options?: {
      filter?: Record<string, unknown>;
      orderBy?: Record<string, unknown>;
      fieldNames?: string[];
    }) => {
      setIsExporting(true);
      setExportProgress({
        status: 'pending',
        processedRecordCount: 0,
        totalRecordCount: 0,
      });

      const { data } = await createRecordExportMutation({
        variables: {
          input: {
            objectNameSingular,
            filter: options?.filter,
            orderBy: options?.orderBy,
            fieldNames: options?.fieldNames,
          },
        },
      });

      const exportId = data?.createRecordExport?.id;

      if (isDefined(exportId)) {
        startPolling(exportId);
      }

      return exportId;
    },
    [objectNameSingular, createRecordExportMutation, startPolling],
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => stopPolling();
  }, [stopPolling]);

  return {
    triggerExport,
    exportProgress,
    isExporting,
  };
};

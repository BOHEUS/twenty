import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { FileFolder } from 'twenty-shared/types';

import { Process } from 'src/engine/core-modules/message-queue/decorators/process.decorator';
import { Processor } from 'src/engine/core-modules/message-queue/decorators/processor.decorator';
import { MessageQueue } from 'src/engine/core-modules/message-queue/message-queue.constants';
import { FileStorageService } from 'src/engine/core-modules/file-storage/file-storage.service';
import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { ObjectMetadataService } from 'src/engine/metadata-modules/object-metadata/object-metadata.service';
import { RecordExportEntity } from 'src/modules/record-export/entities/record-export.entity';
import {
  RecordExportJobData,
  RecordExportStatus,
} from 'src/modules/record-export/types/record-export-job.types';

const EXPORT_BATCH_SIZE = 500;
const MAX_EXPORT_RECORDS = 20_000;

@Processor(MessageQueue.exportQueue)
export class RecordExportJob {
  private readonly logger = new Logger(RecordExportJob.name);

  constructor(
    @InjectRepository(RecordExportEntity)
    private readonly recordExportRepository: Repository<RecordExportEntity>,
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
    private readonly objectMetadataService: ObjectMetadataService,
    private readonly fileStorageService: FileStorageService,
  ) {}

  @Process(RecordExportJob.name)
  async handle(data: RecordExportJobData): Promise<void> {
    const {
      exportId,
      workspaceId,
      objectNameSingular,
      filter,
      orderBy,
      fieldNames,
    } = data;

    this.logger.log(
      `Processing export job ${exportId} for ${objectNameSingular} in workspace ${workspaceId}`,
    );

    try {
      // Mark as processing
      await this.recordExportRepository.update(exportId, {
        status: RecordExportStatus.PROCESSING,
      });

      // Get object metadata to determine field info
      const objectMetadata =
        await this.objectMetadataService.findOneWithinWorkspace(workspaceId, {
          where: { nameSingular: objectNameSingular },
        });

      if (!objectMetadata) {
        throw new Error(`Object metadata not found for ${objectNameSingular}`);
      }

      // Determine which fields to export
      const activeFields = objectMetadata.fields.filter(
        (field) => field.isActive,
      );

      const fieldsToExport = fieldNames
        ? activeFields.filter((f) => fieldNames.includes(f.name))
        : activeFields;

      // Build CSV header
      const csvHeaders = ['id', ...fieldsToExport.map((f) => f.label)];
      const csvFieldNames = ['id', ...fieldsToExport.map((f) => f.name)];

      const csvRows: string[] = [
        csvHeaders.map((h) => this.escapeCsvValue(h)).join(','),
      ];

      // Fetch records in batches using the workspace ORM
      const repository = await this.globalWorkspaceOrmManager.getRepository(
        workspaceId,
        objectNameSingular,
      );

      let offset = 0;
      let totalFetched = 0;

      // Get total count first
      const totalCount = await repository.count({
        where: filter ?? {},
      });

      const recordsToExport = Math.min(totalCount, MAX_EXPORT_RECORDS);

      await this.recordExportRepository.update(exportId, {
        totalRecordCount: recordsToExport,
      });

      while (totalFetched < recordsToExport) {
        const batchSize = Math.min(
          EXPORT_BATCH_SIZE,
          recordsToExport - totalFetched,
        );

        const records = await repository.find({
          where: filter ?? {},
          order: orderBy ?? { createdAt: 'DESC' },
          take: batchSize,
          skip: offset,
        });

        if (records.length === 0) {
          break;
        }

        for (const record of records) {
          const row = csvFieldNames.map((fieldName) => {
            const value = record[fieldName];

            return this.escapeCsvValue(this.formatFieldValue(value));
          });

          csvRows.push(row.join(','));
        }

        totalFetched += records.length;
        offset += records.length;

        // Update progress
        await this.recordExportRepository.update(exportId, {
          processedRecordCount: totalFetched,
        });

        this.logger.log(
          `Export ${exportId}: processed ${totalFetched}/${recordsToExport} records`,
        );
      }

      // Write CSV to file storage
      const csvContent = csvRows.join('\n');
      const filename = `${objectNameSingular}-export-${exportId}.csv`;
      const folder = `${workspaceId}/${FileFolder.Export}`;

      await this.fileStorageService.writeFileLegacy({
        file: csvContent,
        name: filename,
        mimeType: 'text/csv',
        folder,
      });

      const downloadUrl = `${folder}/${filename}`;

      // Mark as completed
      await this.recordExportRepository.update(exportId, {
        status: RecordExportStatus.COMPLETED,
        processedRecordCount: totalFetched,
        downloadUrl,
      });

      this.logger.log(
        `Export ${exportId} completed: ${totalFetched} records exported`,
      );
    } catch (error) {
      this.logger.error(
        `Export ${exportId} failed: ${error.message}`,
        error.stack,
      );

      await this.recordExportRepository.update(exportId, {
        status: RecordExportStatus.FAILED,
        errorMessage: error.message,
      });
    }
  }

  private formatFieldValue(value: unknown): string {
    if (value === null || value === undefined) {
      return '';
    }

    if (typeof value === 'object') {
      // Handle composite fields (e.g., currency, link, address)
      return JSON.stringify(value);
    }

    return String(value);
  }

  private escapeCsvValue(value: string): string {
    if (
      value.includes(',') ||
      value.includes('"') ||
      value.includes('\n') ||
      value.includes('\r')
    ) {
      return `"${value.replace(/"/g, '""')}"`;
    }

    return value;
  }
}

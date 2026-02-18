import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { InjectMessageQueue } from 'src/engine/core-modules/message-queue/decorators/message-queue.decorator';
import { MessageQueue } from 'src/engine/core-modules/message-queue/message-queue.constants';
import { MessageQueueService } from 'src/engine/core-modules/message-queue/services/message-queue.service';
import { RecordExportEntity } from 'src/modules/record-export/entities/record-export.entity';
import { RecordExportJob } from 'src/modules/record-export/jobs/record-export.job';
import {
  RecordExportJobData,
  RecordExportStatus,
} from 'src/modules/record-export/types/record-export-job.types';

@Injectable()
export class RecordExportService {
  private readonly logger = new Logger(RecordExportService.name);

  constructor(
    @InjectRepository(RecordExportEntity)
    private readonly recordExportRepository: Repository<RecordExportEntity>,
    @InjectMessageQueue(MessageQueue.exportQueue)
    private readonly messageQueueService: MessageQueueService,
  ) {}

  async createExport({
    workspaceId,
    objectNameSingular,
    filter,
    orderBy,
    fieldNames,
  }: {
    workspaceId: string;
    objectNameSingular: string;
    filter?: Record<string, any>;
    orderBy?: Record<string, any>;
    fieldNames?: string[];
  }): Promise<RecordExportEntity> {
    // Create export record
    const exportRecord = await this.recordExportRepository.save({
      workspaceId,
      objectNameSingular,
      status: RecordExportStatus.PENDING,
      filter,
      orderBy,
      fieldNames,
    });

    this.logger.log(
      `Created export ${exportRecord.id} for ${objectNameSingular} in workspace ${workspaceId}`,
    );

    // Enqueue background job
    const jobData: RecordExportJobData = {
      workspaceId,
      exportId: exportRecord.id,
      objectNameSingular,
      filter,
      orderBy,
      fieldNames,
    };

    await this.messageQueueService.add<RecordExportJobData>(
      RecordExportJob.name,
      jobData,
    );

    return exportRecord;
  }

  async getExportStatus(
    exportId: string,
    workspaceId: string,
  ): Promise<RecordExportEntity | null> {
    return this.recordExportRepository.findOne({
      where: { id: exportId, workspaceId },
    });
  }
}

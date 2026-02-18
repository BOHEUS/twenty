import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from 'src/engine/guards/jwt-auth.guard';
import { WorkspaceAuthGuard } from 'src/engine/guards/workspace-auth.guard';
import { AuthWorkspace } from 'src/engine/decorators/auth/auth-workspace.decorator';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { RecordExportService } from 'src/modules/record-export/services/record-export.service';
import { RecordExportDTO } from 'src/modules/record-export/dtos/record-export.dto';
import { CreateRecordExportInput } from 'src/modules/record-export/dtos/create-record-export.input';
import { CustomPermissionGuard } from 'src/engine/guards/custom-permission.guard';

@Resolver(() => RecordExportDTO)
@UseGuards(JwtAuthGuard, WorkspaceAuthGuard, CustomPermissionGuard)
export class RecordExportResolver {
  constructor(private readonly recordExportService: RecordExportService) {}

  @Mutation(() => RecordExportDTO)
  async createRecordExport(
    @Args('input') input: CreateRecordExportInput,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<RecordExportDTO> {
    return this.recordExportService.createExport({
      workspaceId: workspace.id,
      objectNameSingular: input.objectNameSingular,
      filter: input.filter,
      orderBy: input.orderBy,
      fieldNames: input.fieldNames,
    });
  }

  @Query(() => RecordExportDTO, { nullable: true })
  async recordExportStatus(
    @Args('exportId') exportId: string,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<RecordExportDTO | null> {
    return this.recordExportService.getExportStatus(exportId, workspace.id);
  }
}

import { Command } from 'nest-commander';
import { isDefined } from 'twenty-shared/utils';

import { ProvisionedWorkspaceCommandRunner } from 'src/database/commands/command-runners/provisioned-workspace.command-runner';
import { WorkspaceIteratorService } from 'src/database/commands/command-runners/workspace-iterator.service';
import { type RunOnWorkspaceArgs } from 'src/database/commands/command-runners/workspace.command-runner';
import { ApplicationService } from 'src/engine/core-modules/application/application.service';
import { RegisteredWorkspaceCommand } from 'src/engine/core-modules/upgrade/decorators/registered-workspace-command.decorator';
import { findFlatEntityByUniversalIdentifier } from 'src/engine/metadata-modules/flat-entity/utils/find-flat-entity-by-universal-identifier.util';
import { type FlatFieldMetadata } from 'src/engine/metadata-modules/flat-field-metadata/types/flat-field-metadata.type';
import { type FlatObjectMetadata } from 'src/engine/metadata-modules/flat-object-metadata/types/flat-object-metadata.type';
import { computeTwentyStandardApplicationAllFlatEntityMaps } from 'src/engine/workspace-manager/twenty-standard-application/utils/twenty-standard-application-all-flat-entity-maps.constant';
import { WorkspaceCacheService } from 'src/engine/workspace-cache/services/workspace-cache.service';
import { WorkspaceMigrationValidateBuildAndRunService } from 'src/engine/workspace-manager/workspace-migration/services/workspace-migration-validate-build-and-run-service';

const MESSAGE_PARTICIPANT_OBJECT_UNIVERSAL_IDENTIFIER =
  '20202020-a433-4456-aa2d-fd9cb26b774a';
const MESSAGE_PARTICIPANT_HANDLE_KIND_FIELD_UNIVERSAL_IDENTIFIER =
  'c36e0135-2ae8-41f7-bc3b-d418a21b3dc7';

@RegisteredWorkspaceCommand('2.34.0', 1787534832185)
@Command({
  name: 'upgrade:2-34:add-message-participant-handle-kind-field',
  description:
    'Add the MessageParticipant handleKind field metadata and column to existing workspaces',
})
export class AddMessageParticipantHandleKindFieldCommand extends ProvisionedWorkspaceCommandRunner {
  constructor(
    protected readonly workspaceIteratorService: WorkspaceIteratorService,
    private readonly applicationService: ApplicationService,
    private readonly workspaceMigrationValidateBuildAndRunService: WorkspaceMigrationValidateBuildAndRunService,
    private readonly workspaceCacheService: WorkspaceCacheService,
  ) {
    super(workspaceIteratorService);
  }

  override async runOnWorkspace({
    workspaceId,
    options,
  }: RunOnWorkspaceArgs): Promise<void> {
    const isDryRun = options.dryRun ?? false;

    const { flatFieldMetadataMaps, flatObjectMetadataMaps } =
      await this.workspaceCacheService.getOrRecompute(workspaceId, [
        'flatFieldMetadataMaps',
        'flatObjectMetadataMaps',
      ]);

    const messageParticipantObjectMetadata =
      findFlatEntityByUniversalIdentifier<FlatObjectMetadata>({
        flatEntityMaps: flatObjectMetadataMaps,
        universalIdentifier: MESSAGE_PARTICIPANT_OBJECT_UNIVERSAL_IDENTIFIER,
      });

    if (!isDefined(messageParticipantObjectMetadata)) {
      this.logger.log(
        `MessageParticipant object does not exist for workspace ${workspaceId}, skipping`,
      );

      return;
    }

    const existingHandleKindFieldMetadata =
      findFlatEntityByUniversalIdentifier<FlatFieldMetadata>({
        flatEntityMaps: flatFieldMetadataMaps,
        universalIdentifier:
          MESSAGE_PARTICIPANT_HANDLE_KIND_FIELD_UNIVERSAL_IDENTIFIER,
      });

    if (isDefined(existingHandleKindFieldMetadata)) {
      this.logger.log(
        `MessageParticipant handleKind field already present for workspace ${workspaceId}`,
      );

      return;
    }

    const { twentyStandardFlatApplication } =
      await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow(
        { workspaceId },
      );

    const { allFlatEntityMaps: standardAllFlatEntityMaps } =
      computeTwentyStandardApplicationAllFlatEntityMaps({
        now: new Date().toISOString(),
        workspaceId,
        twentyStandardApplicationId: twentyStandardFlatApplication.id,
      });

    const handleKindFlatFieldMetadata =
      findFlatEntityByUniversalIdentifier<FlatFieldMetadata>({
        flatEntityMaps: standardAllFlatEntityMaps.flatFieldMetadataMaps,
        universalIdentifier:
          MESSAGE_PARTICIPANT_HANDLE_KIND_FIELD_UNIVERSAL_IDENTIFIER,
      });

    if (!isDefined(handleKindFlatFieldMetadata)) {
      throw new Error(
        'Standard application is missing the MessageParticipant handleKind field metadata',
      );
    }

    if (isDryRun) {
      this.logger.log(
        `[DRY RUN] Would create MessageParticipant handleKind field for workspace ${workspaceId}`,
      );

      return;
    }

    const validateAndBuildResult =
      await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunWorkspaceMigration(
        {
          isSystemBuild: true,
          allFlatEntityOperationByMetadataName: {
            fieldMetadata: {
              flatEntityToCreate: [handleKindFlatFieldMetadata],
              flatEntityToDelete: [],
              flatEntityToUpdate: [],
            },
          },
          workspaceId,
          applicationUniversalIdentifier:
            twentyStandardFlatApplication.universalIdentifier,
        },
      );

    if (validateAndBuildResult.status === 'fail') {
      this.logger.error(
        `Failed to create MessageParticipant handleKind field:\n${JSON.stringify(
          validateAndBuildResult,
          null,
          2,
        )}`,
      );

      throw new Error(
        `Failed to create MessageParticipant handleKind field for workspace ${workspaceId}`,
      );
    }

    this.logger.log(
      `Created MessageParticipant handleKind field for workspace ${workspaceId}`,
    );
  }
}

import { Command } from 'nest-commander';
import { STANDARD_OBJECTS } from 'twenty-shared/metadata';
import { FieldMetadataType } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';
import { type DataSource } from 'typeorm';

import { ProvisionedWorkspaceCommandRunner } from 'src/database/commands/command-runners/provisioned-workspace.command-runner';
import { WorkspaceIteratorService } from 'src/database/commands/command-runners/workspace-iterator.service';
import { type RunOnWorkspaceArgs } from 'src/database/commands/command-runners/workspace.command-runner';
import { type RichTextValueMapping } from 'src/database/commands/upgrade-version-command/2-45/types/rich-text-value-mapping.type';
import { addTiptapToRichTextValue } from 'src/database/commands/upgrade-version-command/2-45/utils/add-tiptap-to-rich-text-value.util';
import { mapRecordCrudRichTextFields } from 'src/database/commands/upgrade-version-command/2-45/utils/map-record-crud-rich-text-fields.util';
import { removeTiptapFromRichTextValue } from 'src/database/commands/upgrade-version-command/2-45/utils/remove-tiptap-from-rich-text-value.util';
import { RegisteredWorkspaceCommand } from 'src/engine/core-modules/upgrade/decorators/registered-workspace-command.decorator';
import { plaintextStringSchema } from 'src/engine/core-modules/secret-encryption/branded-strings/plaintext-string.type';
import { type EncryptedString } from 'src/engine/core-modules/secret-encryption/branded-strings/encrypted-string.type';
import { SecretEncryptionService } from 'src/engine/core-modules/secret-encryption/secret-encryption.service';
import { WorkflowVersionCoreSyncService } from 'src/engine/core-modules/workflow/services/workflow-version-core-sync.service';
import { findManyFlatEntityByIdInFlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/utils/find-many-flat-entity-by-id-in-flat-entity-maps.util';
import { findFlatEntityByUniversalIdentifier } from 'src/engine/metadata-modules/flat-entity/utils/find-flat-entity-by-universal-identifier.util';
import { type FlatObjectMetadata } from 'src/engine/metadata-modules/flat-object-metadata/types/flat-object-metadata.type';
import { WidgetConfigurationType } from 'src/engine/metadata-modules/page-layout-widget/enums/widget-configuration-type.type';
import { WorkspaceOrmManager } from 'src/engine/twenty-orm/workspace-orm.manager';
import { getWorkspaceSchemaName } from 'src/engine/workspace-datasource/utils/get-workspace-schema-name.util';
import { WorkspaceCacheService } from 'src/engine/workspace-cache/services/workspace-cache.service';
import { type WorkflowVersionWorkspaceEntity } from 'src/modules/workflow/common/standard-objects/workflow-version.workspace-entity';

type StoreMappingArgs = {
  workspaceId: string;
  dataSource: DataSource;
  isDryRun: boolean;
  counts: ConfigurationBackfillCounts;
  mapValue: RichTextValueMapping;
};

type ConfigurationBackfillCounts = {
  widgets: number;
  workflowVersions: number;
  applicationVariables: number;
  failed: number;
};

@RegisteredWorkspaceCommand('2.45.0', 1790952826000)
@Command({
  name: 'upgrade:2-45:backfill-rich-text-tiptap-in-configurations',
  description:
    'Add tiptap to rich text values stored outside record columns: dashboard rich text widgets, workflow record steps and RICH_TEXT application variables. blocknote and markdown are kept.',
})
export class BackfillRichTextTiptapInConfigurationsCommand extends ProvisionedWorkspaceCommandRunner {
  constructor(
    protected readonly workspaceIteratorService: WorkspaceIteratorService,
    private readonly workspaceCacheService: WorkspaceCacheService,
    private readonly workspaceOrmManager: WorkspaceOrmManager,
    private readonly workflowVersionCoreSyncService: WorkflowVersionCoreSyncService,
    private readonly secretEncryptionService: SecretEncryptionService,
  ) {
    super(workspaceIteratorService);
  }

  override async runOnWorkspace(args: RunOnWorkspaceArgs): Promise<void> {
    await this.up(args);
  }

  async up(args: RunOnWorkspaceArgs) {
    await this.mapStores(args, addTiptapToRichTextValue);
  }

  // blocknote and markdown were never modified, so dropping tiptap restores
  // every value.
  async down(args: RunOnWorkspaceArgs) {
    await this.mapStores(args, removeTiptapFromRichTextValue);
  }

  private async mapStores(
    { workspaceId, options, dataSource }: RunOnWorkspaceArgs,
    mapValue: RichTextValueMapping,
  ) {
    if (!isDefined(dataSource)) {
      return;
    }

    const isDryRun = options.dryRun ?? false;
    const counts: ConfigurationBackfillCounts = {
      widgets: 0,
      workflowVersions: 0,
      applicationVariables: 0,
      failed: 0,
    };
    const storeMappingArgs: StoreMappingArgs = {
      workspaceId,
      dataSource,
      isDryRun,
      counts,
      mapValue,
    };

    await this.mapWidgets(storeMappingArgs);
    await this.mapWorkflowVersions(storeMappingArgs);
    await this.mapApplicationVariables(storeMappingArgs);

    if (!isDryRun) {
      await this.workspaceCacheService.invalidateAndRecompute(workspaceId, [
        'flatPageLayoutWidgetMaps',
        'applicationVariableMaps',
      ]);
    }

    this.logger.log(
      `${isDryRun ? '[DRY RUN] ' : ''}Updated tiptap for workspace ${workspaceId}: ${counts.widgets} widget(s), ${counts.workflowVersions} workflow version(s), ${counts.applicationVariables} application variable(s), ${counts.failed} failed`,
    );
  }

  private async mapWidgets({
    workspaceId,
    dataSource,
    isDryRun,
    counts,
    mapValue,
  }: StoreMappingArgs) {
    const widgets: { id: string; body: unknown }[] = await dataSource.query(
      `SELECT id, configuration->'body' AS body FROM core."pageLayoutWidget"
       WHERE "workspaceId" = $1 AND configuration->>'configurationType' = $2`,
      [workspaceId, WidgetConfigurationType.STANDALONE_RICH_TEXT],
    );

    for (const widget of widgets) {
      const result = this.mapSafely(mapValue, widget.body, counts);

      if (!result.hasChanged) {
        continue;
      }

      counts.widgets++;

      if (!isDryRun) {
        await dataSource.query(
          `UPDATE core."pageLayoutWidget"
           SET configuration = jsonb_set(configuration, '{body}', $1::jsonb)
           WHERE id = $2 AND "workspaceId" = $3`,
          [JSON.stringify(result.value), widget.id, workspaceId],
        );
      }
    }
  }

  private async mapWorkflowVersions({
    workspaceId,
    dataSource,
    isDryRun,
    counts,
    mapValue,
  }: StoreMappingArgs) {
    const richTextFieldNamesByObjectName =
      await this.getRichTextFieldNamesByObjectName(workspaceId);

    if (!isDefined(richTextFieldNamesByObjectName)) {
      return;
    }

    const workflowVersionRepository =
      await this.workspaceOrmManager.getRepository<WorkflowVersionWorkspaceEntity>(
        'workflowVersion',
        { shouldBypassPermissionChecks: true },
      );

    const versionsToSyncToCore: WorkflowVersionWorkspaceEntity[] = [];

    for (const version of await workflowVersionRepository.find()) {
      const { value, hasChanged } = mapRecordCrudRichTextFields({
        steps: version.steps,
        richTextFieldNamesByObjectName,
        mapValue,
      });

      if (!hasChanged) {
        continue;
      }

      counts.workflowVersions++;
      versionsToSyncToCore.push({ ...version, steps: value });

      if (!isDryRun) {
        await dataSource.query(
          `UPDATE "${getWorkspaceSchemaName(workspaceId)}"."workflowVersion" SET steps = $1::jsonb WHERE id = $2`,
          [JSON.stringify(value), version.id],
        );
      }
    }

    if (!isDryRun && versionsToSyncToCore.length > 0) {
      await this.workflowVersionCoreSyncService.upsertToCore(
        workspaceId,
        versionsToSyncToCore,
      );
    }
  }

  private async mapApplicationVariables({
    workspaceId,
    dataSource,
    isDryRun,
    counts,
    mapValue,
  }: StoreMappingArgs) {
    const variables: { id: string; value: EncryptedString }[] =
      await dataSource.query(
        `SELECT id, value FROM core."applicationVariable"
         WHERE "workspaceId" = $1 AND type = $2`,
        [workspaceId, FieldMetadataType.RICH_TEXT],
      );

    for (const variable of variables) {
      let parsedValue: unknown;

      try {
        parsedValue = JSON.parse(
          this.secretEncryptionService.decryptVersionedOrThrow(variable.value, {
            workspaceId,
          }),
        );
      } catch {
        continue;
      }

      const result = this.mapSafely(mapValue, parsedValue, counts);

      if (!result.hasChanged) {
        continue;
      }

      counts.applicationVariables++;

      if (!isDryRun) {
        await dataSource.query(
          `UPDATE core."applicationVariable" SET value = $1 WHERE id = $2 AND "workspaceId" = $3`,
          [
            this.secretEncryptionService.encryptVersioned(
              plaintextStringSchema.parse(JSON.stringify(result.value)),
              { workspaceId },
            ),
            variable.id,
            workspaceId,
          ],
        );
      }
    }
  }

  private mapSafely(
    mapValue: RichTextValueMapping,
    value: unknown,
    counts: ConfigurationBackfillCounts,
  ): { value: unknown; hasChanged: boolean } {
    try {
      return mapValue(value);
    } catch (error) {
      counts.failed++;
      this.logger.error(`Failed to convert a rich text value: ${error}`);

      return { value, hasChanged: false };
    }
  }

  private async getRichTextFieldNamesByObjectName(
    workspaceId: string,
  ): Promise<Record<string, string[]> | undefined> {
    const { flatObjectMetadataMaps, flatFieldMetadataMaps } =
      await this.workspaceCacheService.getOrRecompute(workspaceId, [
        'flatObjectMetadataMaps',
        'flatFieldMetadataMaps',
      ]);

    const workflowVersionObject =
      findFlatEntityByUniversalIdentifier<FlatObjectMetadata>({
        flatEntityMaps: flatObjectMetadataMaps,
        universalIdentifier:
          STANDARD_OBJECTS.workflowVersion.universalIdentifier,
      });

    if (!isDefined(workflowVersionObject)) {
      return undefined;
    }

    return Object.fromEntries(
      Object.values(flatObjectMetadataMaps.byUniversalIdentifier)
        .filter(isDefined)
        .map((flatObjectMetadata): [string, string[]] => [
          flatObjectMetadata.nameSingular,
          findManyFlatEntityByIdInFlatEntityMaps({
            flatEntityIds: flatObjectMetadata.fieldIds,
            flatEntityMaps: flatFieldMetadataMaps,
          })
            .filter((field) => field.type === FieldMetadataType.RICH_TEXT)
            .map((field) => field.name),
        ])
        .filter(([, fieldNames]) => fieldNames.length > 0),
    );
  }
}

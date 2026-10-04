import { Command } from 'nest-commander';
import { STANDARD_OBJECTS } from 'twenty-shared/metadata';
import { isDefined } from 'twenty-shared/utils';
import { type DataSource } from 'typeorm';

import { ProvisionedWorkspaceCommandRunner } from 'src/database/commands/command-runners/provisioned-workspace.command-runner';
import { WorkspaceIteratorService } from 'src/database/commands/command-runners/workspace-iterator.service';
import { type RunOnWorkspaceArgs } from 'src/database/commands/command-runners/workspace.command-runner';
import { getStandardFlatEntitiesToCreateOrThrow } from 'src/database/commands/upgrade-version-command/2-10/utils/get-standard-flat-entities-to-create-or-throw.util';
import {
  normalizeStoredPhonesValue,
  type StoredPhonesValue,
} from 'src/database/commands/upgrade-version-command/2-46/utils/normalize-stored-phones-value.util';
import { ApplicationService } from 'src/engine/core-modules/application/application.service';
import { RegisteredWorkspaceCommand } from 'src/engine/core-modules/upgrade/decorators/registered-workspace-command.decorator';
import { findFlatEntityByUniversalIdentifier } from 'src/engine/metadata-modules/flat-entity/utils/find-flat-entity-by-universal-identifier.util';
import { type FlatIndexMetadata } from 'src/engine/metadata-modules/flat-index-metadata/types/flat-index-metadata.type';
import { WorkspaceCacheService } from 'src/engine/workspace-cache/services/workspace-cache.service';
import { getWorkspaceSchemaName } from 'src/engine/workspace-datasource/utils/get-workspace-schema-name.util';
import { computeTwentyStandardApplicationAllFlatEntityMaps } from 'src/engine/workspace-manager/twenty-standard-application/utils/twenty-standard-application-all-flat-entity-maps.constant';
import { WorkspaceMigrationBuilderException } from 'src/engine/workspace-manager/workspace-migration/exceptions/workspace-migration-builder-exception';
import { WorkspaceMigrationValidateBuildAndRunService } from 'src/engine/workspace-manager/workspace-migration/services/workspace-migration-validate-build-and-run-service';
import { escapeIdentifier } from 'src/engine/workspace-manager/workspace-migration/utils/remove-sql-injection.util';

const PHONE_INDEX_UNIVERSAL_IDENTIFIERS = [
  STANDARD_OBJECTS.person.indexes.phonesIndex.universalIdentifier,
  STANDARD_OBJECTS.person.indexes.phonesAdditionalPhonesGinIndex
    .universalIdentifier,
];

const PERSON_BATCH_SIZE = 500;

type PersonPhonesRow = StoredPhonesValue & { id: string };

@RegisteredWorkspaceCommand('2.46.0', 1791100000000)
@Command({
  name: 'upgrade:2-46:add-person-phone-indexes-and-normalize-phones',
  description:
    'Index person phones for exact caller-id lookups and bring phones stored before the record transformer to its normalized shape',
})
export class AddPersonPhoneIndexesAndNormalizePhonesCommand extends ProvisionedWorkspaceCommandRunner {
  constructor(
    protected readonly workspaceIteratorService: WorkspaceIteratorService,
    private readonly applicationService: ApplicationService,
    private readonly workspaceCacheService: WorkspaceCacheService,
    private readonly workspaceMigrationValidateBuildAndRunService: WorkspaceMigrationValidateBuildAndRunService,
  ) {
    super(workspaceIteratorService);
  }

  override async runOnWorkspace(args: RunOnWorkspaceArgs): Promise<void> {
    await this.up(args);
  }

  async up({
    workspaceId,
    options,
    dataSource,
  }: RunOnWorkspaceArgs): Promise<void> {
    const isDryRun = options.dryRun ?? false;

    // Data first: the GIN index is cheaper to build over normalized rows,
    // and a normalized row is what the exact-match lookup needs either way.
    await this.normalizePersonPhones({ workspaceId, dataSource, isDryRun });
    await this.createMissingPhoneIndexes({ workspaceId, isDryRun });
  }

  // Normalization is one-way: the original formatting is not kept.
  async down({ workspaceId, options }: RunOnWorkspaceArgs): Promise<void> {
    const { flatIndexMaps } = await this.workspaceCacheService.getOrRecompute(
      workspaceId,
      ['flatIndexMaps'],
    );

    const indexesToDelete = PHONE_INDEX_UNIVERSAL_IDENTIFIERS.map(
      (universalIdentifier) =>
        findFlatEntityByUniversalIdentifier<FlatIndexMetadata>({
          flatEntityMaps: flatIndexMaps,
          universalIdentifier,
        }),
    ).filter(isDefined);

    if (indexesToDelete.length === 0) {
      return;
    }

    if (options.dryRun ?? false) {
      this.logger.log(
        `[DRY RUN] Would drop ${indexesToDelete.length} phone index(es) for workspace ${workspaceId}`,
      );

      return;
    }

    const { twentyStandardFlatApplication } =
      await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow(
        { workspaceId },
      );

    const result =
      await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunLegacyWorkspaceMigration(
        {
          workspaceId,
          isSystemBuild: true,
          applicationUniversalIdentifier:
            twentyStandardFlatApplication.universalIdentifier,
          allFlatEntityOperationByMetadataName: {
            index: {
              flatEntityToCreate: [],
              flatEntityToDelete: indexesToDelete,
              flatEntityToUpdate: [],
            },
          },
        },
      );

    if (result.status === 'fail') {
      throw new WorkspaceMigrationBuilderException(
        result,
        `Failed to drop person phone indexes for workspace ${workspaceId}`,
      );
    }
  }

  private async normalizePersonPhones({
    workspaceId,
    dataSource,
    isDryRun,
  }: {
    workspaceId: string;
    dataSource?: DataSource;
    isDryRun: boolean;
  }): Promise<void> {
    if (!isDefined(dataSource)) {
      this.logger.warn(
        `No data source for workspace ${workspaceId}, skipping phone normalization`,
      );

      return;
    }

    const personTable = `${escapeIdentifier(getWorkspaceSchemaName(workspaceId))}."person"`;

    let lastId: string | null = null;
    let scannedCount = 0;
    let changedCount = 0;

    for (;;) {
      const rows: PersonPhonesRow[] = await dataSource.query(
        `SELECT id,
           "phonesPrimaryPhoneNumber" AS "primaryPhoneNumber",
           "phonesPrimaryPhoneCallingCode" AS "primaryPhoneCallingCode",
           "phonesPrimaryPhoneCountryCode" AS "primaryPhoneCountryCode",
           "phonesAdditionalPhones" AS "additionalPhones"
         FROM ${personTable}
         WHERE (COALESCE("phonesPrimaryPhoneNumber", '') <> ''
             OR "phonesAdditionalPhones" IS NOT NULL)
           AND ($1::uuid IS NULL OR id > $1::uuid)
         ORDER BY id
         LIMIT $2`,
        [lastId, PERSON_BATCH_SIZE],
      );

      if (rows.length === 0) {
        break;
      }

      scannedCount += rows.length;
      lastId = rows[rows.length - 1].id;

      for (const row of rows) {
        const { value, hasChanged } = normalizeStoredPhonesValue(row);

        if (!hasChanged) {
          continue;
        }

        changedCount += 1;

        if (isDryRun) {
          continue;
        }

        await dataSource.query(
          `UPDATE ${personTable}
           SET "phonesPrimaryPhoneNumber" = $2,
               "phonesPrimaryPhoneCallingCode" = $3,
               "phonesPrimaryPhoneCountryCode" = $4,
               "phonesAdditionalPhones" = $5::jsonb
           WHERE id = $1`,
          [
            row.id,
            value.primaryPhoneNumber,
            value.primaryPhoneCallingCode,
            value.primaryPhoneCountryCode,
            isDefined(value.additionalPhones)
              ? JSON.stringify(value.additionalPhones)
              : null,
          ],
        );
      }
    }

    this.logger.log(
      `${isDryRun ? '[DRY RUN] ' : ''}Workspace ${workspaceId}: scanned ${scannedCount} people with phones, ${isDryRun ? 'would normalize' : 'normalized'} ${changedCount}`,
    );
  }

  private async createMissingPhoneIndexes({
    workspaceId,
    isDryRun,
  }: {
    workspaceId: string;
    isDryRun: boolean;
  }): Promise<void> {
    const { flatIndexMaps } = await this.workspaceCacheService.getOrRecompute(
      workspaceId,
      ['flatIndexMaps'],
    );

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

    const indexesToCreate =
      getStandardFlatEntitiesToCreateOrThrow<FlatIndexMetadata>({
        standardFlatEntityMaps: standardAllFlatEntityMaps.flatIndexMaps,
        existingFlatEntityMaps: flatIndexMaps,
        universalIdentifiers: PHONE_INDEX_UNIVERSAL_IDENTIFIERS,
      });

    if (indexesToCreate.length === 0) {
      return;
    }

    if (isDryRun) {
      this.logger.log(
        `[DRY RUN] Would create ${indexesToCreate.length} phone index(es) for workspace ${workspaceId}`,
      );

      return;
    }

    const result =
      await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunLegacyWorkspaceMigration(
        {
          workspaceId,
          isSystemBuild: true,
          applicationUniversalIdentifier:
            twentyStandardFlatApplication.universalIdentifier,
          allFlatEntityOperationByMetadataName: {
            index: {
              flatEntityToCreate: indexesToCreate,
              flatEntityToDelete: [],
              flatEntityToUpdate: [],
            },
          },
        },
      );

    if (result.status === 'fail') {
      throw new WorkspaceMigrationBuilderException(
        result,
        `Failed to create person phone indexes for workspace ${workspaceId}`,
      );
    }
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { msg } from '@lingui/core/macro';
import { type RequiredApplicationManifest } from 'twenty-shared/application';
import { isNonEmptyArray } from 'twenty-shared/utils';
import { In, Repository } from 'typeorm';

import { findDependentApplications } from 'src/engine/core-modules/application/application-dependency/utils/find-dependent-applications.util';
import { findUnsatisfiedRequiredApplications } from 'src/engine/core-modules/application/application-dependency/utils/find-unsatisfied-required-applications.util';
import { ApplicationRegistrationEntity } from 'src/engine/core-modules/application/application-registration/application-registration.entity';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from 'src/engine/core-modules/application/application.exception';
import { ApplicationEntity } from 'src/engine/core-modules/application/application.entity';
import { assertRequiredApplicationsManifestIsValidOrThrow } from 'src/engine/core-modules/application/utils/assert-required-applications-manifest-is-valid-or-throw.util';
import { InjectWorkspaceScopedRepository } from 'src/engine/twenty-orm/workspace-scoped-repository/inject-workspace-scoped-repository.decorator';
import { WorkspaceScopedRepository } from 'src/engine/twenty-orm/workspace-scoped-repository/workspace-scoped-repository';

type DependentApplication = Pick<
  ApplicationEntity,
  'id' | 'universalIdentifier' | 'name' | 'requiredApplications'
>;

// Reads the database rather than the workspace cache: callers hold the
// application dependency lock and must see every completed lifecycle change.
@Injectable()
export class ApplicationDependencyService {
  constructor(
    @InjectWorkspaceScopedRepository(ApplicationEntity)
    private readonly applicationRepository: WorkspaceScopedRepository<ApplicationEntity>,
    @InjectRepository(ApplicationRegistrationEntity)
    private readonly applicationRegistrationRepository: Repository<ApplicationRegistrationEntity>,
  ) {}

  async findDependentApplications({
    applicationUniversalIdentifier,
    workspaceId,
  }: {
    applicationUniversalIdentifier: string;
    workspaceId: string;
  }): Promise<DependentApplication[]> {
    const applications = await this.applicationRepository.find(workspaceId, {
      select: ['id', 'universalIdentifier', 'name', 'requiredApplications'],
    });

    return findDependentApplications({
      applications,
      applicationUniversalIdentifier,
    });
  }

  async assertHasNoDependentApplicationsOrThrow({
    applicationUniversalIdentifier,
    workspaceId,
  }: {
    applicationUniversalIdentifier: string;
    workspaceId: string;
  }): Promise<void> {
    const dependentApplications = await this.findDependentApplications({
      applicationUniversalIdentifier,
      workspaceId,
    });

    if (!isNonEmptyArray(dependentApplications)) {
      return;
    }

    const dependentApplicationNames = dependentApplications
      .map(({ name }) => name)
      .join(', ');

    throw new ApplicationException(
      `Application ${applicationUniversalIdentifier} is required by ${dependentApplicationNames} in workspace ${workspaceId}`,
      ApplicationExceptionCode.APPLICATION_HAS_DEPENDENTS,
      {
        userFriendlyMessage: msg`Other apps depend on this app: ${dependentApplicationNames}. Uninstall them first.`,
      },
    );
  }

  async assertRequiredApplicationsAreInstalledOrThrow({
    applicationUniversalIdentifier,
    requiredApplications,
    workspaceId,
  }: {
    applicationUniversalIdentifier: string;
    requiredApplications: RequiredApplicationManifest[] | undefined;
    workspaceId: string;
  }): Promise<void> {
    assertRequiredApplicationsManifestIsValidOrThrow({
      universalIdentifier: applicationUniversalIdentifier,
      requiredApplications,
    });

    if (!isNonEmptyArray(requiredApplications)) {
      return;
    }

    const installedApplications = await this.applicationRepository.find(
      workspaceId,
      {
        select: ['universalIdentifier', 'name', 'version', 'canBeUninstalled'],
        where: {
          universalIdentifier: In(
            requiredApplications.map(
              ({ universalIdentifier }) => universalIdentifier,
            ),
          ),
        },
      },
    );

    const {
      missingUniversalIdentifiers,
      unrequirableApplicationNames,
      incompatibleVersionDescriptions,
    } = findUnsatisfiedRequiredApplications({
      requiredApplications,
      installedApplications,
    });

    if (isNonEmptyArray(unrequirableApplicationNames)) {
      const applicationNames = unrequirableApplicationNames.join(', ');

      throw new ApplicationException(
        `System applications cannot be required: ${applicationNames}`,
        ApplicationExceptionCode.INVALID_INPUT,
        {
          userFriendlyMessage: msg`This app declares a dependency on a built-in app, which is not allowed. Contact its developer.`,
        },
      );
    }

    if (isNonEmptyArray(missingUniversalIdentifiers)) {
      const missingApplicationNames = (
        await this.findMissingApplicationNames(missingUniversalIdentifiers)
      ).join(', ');

      throw new ApplicationException(
        `Required applications are not installed in workspace ${workspaceId}: ${missingApplicationNames}`,
        ApplicationExceptionCode.REQUIRED_APPLICATION_NOT_INSTALLED,
        {
          userFriendlyMessage: msg`This app depends on apps that are not installed in this workspace: ${missingApplicationNames}. Install them first.`,
        },
      );
    }

    if (isNonEmptyArray(incompatibleVersionDescriptions)) {
      const incompatibleVersions = incompatibleVersionDescriptions.join(', ');

      throw new ApplicationException(
        `Required applications have incompatible versions in workspace ${workspaceId}: ${incompatibleVersions}`,
        ApplicationExceptionCode.REQUIRED_APPLICATION_VERSION_INCOMPATIBLE,
        {
          userFriendlyMessage: msg`This app needs other versions of the apps it depends on: ${incompatibleVersions}. Upgrade them first.`,
        },
      );
    }
  }

  // Only marketplace-listed registrations are public, so other missing
  // applications stay identified by their universal identifier
  private async findMissingApplicationNames(
    missingUniversalIdentifiers: string[],
  ): Promise<string[]> {
    const listedRegistrations =
      await this.applicationRegistrationRepository.find({
        select: ['universalIdentifier', 'name'],
        where: {
          universalIdentifier: In(missingUniversalIdentifiers),
          isListed: true,
        },
      });

    return missingUniversalIdentifiers.map(
      (universalIdentifier) =>
        listedRegistrations.find(
          (registration) =>
            registration.universalIdentifier === universalIdentifier,
        )?.name ?? universalIdentifier,
    );
  }
}

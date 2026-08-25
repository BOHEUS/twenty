import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { isNonEmptyString, isNull } from '@sniptt/guards';
import chunk from 'lodash.chunk';
import compact from 'lodash.compact';
import uniqBy from 'lodash.uniqby';
import {
  ConnectedAccountProvider,
  FieldActorSource,
  type FullNameMetadata,
  MessageHandleKind,
  type PhonesMetadata,
} from 'twenty-shared/types';
import { capitalize, isDefined } from 'twenty-shared/utils';
import { In, IsNull, type DeepPartial, type Repository } from 'typeorm';
import { v4 } from 'uuid';

import { ExceptionHandlerService } from 'src/engine/core-modules/exception-handler/exception-handler.service';
import { UserWorkspaceEntity } from 'src/engine/core-modules/user-workspace/user-workspace.entity';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { type ConnectedAccountEntity } from 'src/engine/metadata-modules/connected-account/entities/connected-account.entity';
import {
  TwentyORMException,
  TwentyORMExceptionCode,
} from 'src/engine/twenty-orm/exceptions/twenty-orm.exception';
import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { type WorkspaceRepository } from 'src/engine/twenty-orm/repository/workspace.repository';
import { buildSystemAuthContext } from 'src/engine/twenty-orm/utils/build-system-auth-context.util';
import { CONTACTS_CREATION_BATCH_SIZE } from 'src/modules/contact-creation-manager/constants/contacts-creation-batch-size.constant';
import { CreateCompanyService } from 'src/modules/contact-creation-manager/services/create-company.service';
import { CreatePersonService } from 'src/modules/contact-creation-manager/services/create-person.service';
import { type Contact } from 'src/modules/contact-creation-manager/types/contact.type';
import { filterOutContactsThatBelongToSelfOrWorkspaceMembers } from 'src/modules/contact-creation-manager/utils/filter-out-contacts-that-belong-to-self-or-workspace-members.util';
import { getDomainNameFromHandle } from 'src/modules/contact-creation-manager/utils/get-domain-name-from-handle.util';
import { getFirstNameAndLastNameFromHandleAndDisplayName } from 'src/modules/contact-creation-manager/utils/get-first-name-and-last-name-from-handle-and-display-name.util';
import { getUniqueContactsAndHandles } from 'src/modules/contact-creation-manager/utils/get-unique-contacts-and-handles.util';
import { getParsedNameFromDisplayName } from 'src/modules/contact-creation-manager/utils/get-parsed-name-from-display-name.util';
import { addPersonEmailFiltersToQueryBuilder } from 'src/modules/match-participant/utils/add-person-email-filters-to-query-builder';
import { addPersonPhoneFiltersToQueryBuilder } from 'src/modules/match-participant/utils/add-person-phone-filters-to-query-builder';
import { findPersonByPrimaryOrAdditionalPhone } from 'src/modules/match-participant/utils/find-person-by-primary-or-additional-phone';
import { findPersonIdsByRememberedHandles } from 'src/modules/match-participant/utils/find-person-ids-by-remembered-handles.util';
import { type MessageParticipantWorkspaceEntity } from 'src/modules/messaging/common/standard-objects/message-participant.workspace-entity';
import { parsePhoneHandle } from 'src/modules/match-participant/utils/parse-phone-handle.util';
import { PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';
import { WorkspaceMemberWorkspaceEntity } from 'src/modules/workspace-member/standard-objects/workspace-member.workspace-entity';
import { computeDisplayName } from 'src/utils/compute-display-name';
import { isWorkDomain, isWorkEmail } from 'src/utils/is-work-email';

const isDuplicateEntryError = (error: unknown) =>
  error instanceof TwentyORMException &&
  error.code === TwentyORMExceptionCode.DUPLICATE_ENTRY_DETECTED;

@Injectable()
export class CreateCompanyAndPersonService {
  private readonly logger = new Logger(CreateCompanyAndPersonService.name);

  constructor(
    private readonly createPersonService: CreatePersonService,
    private readonly createCompaniesService: CreateCompanyService,
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
    private readonly exceptionHandlerService: ExceptionHandlerService,
    @InjectRepository(UserWorkspaceEntity)
    private readonly userWorkspaceRepository: Repository<UserWorkspaceEntity>,
    @InjectRepository(WorkspaceEntity)
    private readonly workspaceRepository: Repository<WorkspaceEntity>,
  ) {}

  async createCompaniesAndPeople(
    connectedAccount: ConnectedAccountEntity,
    contactsToCreate: Contact[],
    workspaceId: string,
    source: FieldActorSource,
    accountOwner: WorkspaceMemberWorkspaceEntity | null,
  ): Promise<DeepPartial<PersonWorkspaceEntity>[]> {
    if (!contactsToCreate || contactsToCreate.length === 0) {
      return [];
    }

    const authContext = buildSystemAuthContext(workspaceId);

    return this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const personRepository =
          await this.globalWorkspaceOrmManager.getRepository(
            workspaceId,
            PersonWorkspaceEntity,
            {
              shouldBypassPermissionChecks: true,
            },
          );

        const workspaceMemberRepository =
          await this.globalWorkspaceOrmManager.getRepository(
            workspaceId,
            WorkspaceMemberWorkspaceEntity,
            { shouldBypassPermissionChecks: true },
          );

        const workspaceMembers = await workspaceMemberRepository.find();

        const workspace = await this.workspaceRepository.findOne({
          where: { id: workspaceId },
          select: ['id', 'isInternalMessagesImportEnabled'],
        });

        const peopleToCreateFromOtherCompanies =
          filterOutContactsThatBelongToSelfOrWorkspaceMembers(
            contactsToCreate,
            connectedAccount,
            workspaceMembers,
            workspace?.isInternalMessagesImportEnabled ?? false,
          );

        const createdPeopleFromPhones =
          await this.createPeopleFromPhoneContacts({
            phoneContacts: peopleToCreateFromOtherCompanies.filter(
              (contact) => contact.handleKind === MessageHandleKind.PHONE,
            ),
            personRepository,
            workspaceId,
            source,
            connectedAccount,
            accountOwner,
          });

        const createdPeopleFromExternalHandles =
          await this.createPeopleFromExternalContacts({
            externalContacts: peopleToCreateFromOtherCompanies.filter(
              (contact) => contact.handleKind === MessageHandleKind.EXTERNAL,
            ),
            workspaceId,
            source,
            connectedAccount,
            accountOwner,
          });

        const { uniqueContacts, uniqueHandles } = getUniqueContactsAndHandles(
          peopleToCreateFromOtherCompanies.filter(
            (contact) =>
              (contact.handleKind ?? MessageHandleKind.EMAIL) ===
              MessageHandleKind.EMAIL,
          ),
        );

        if (uniqueHandles.length === 0) {
          return [
            ...createdPeopleFromPhones,
            ...createdPeopleFromExternalHandles,
          ];
        }

        const queryBuilder = addPersonEmailFiltersToQueryBuilder({
          queryBuilder: personRepository.createQueryBuilder('person'),
          emails: uniqueHandles,
        });

        const alreadyCreatedPeople = await queryBuilder
          .orderBy('person.createdAt', 'ASC')
          .withDeleted()
          .getMany();

        const {
          contactsThatNeedPersonCreate,
          contactsThatNeedPersonRestore,
          peopleToEnrichNames,
          workDomainNamesToCreate,
          shouldCreateOrRestorePeopleByHandleMap,
        } =
          this.computeContactsThatNeedPersonCreateAndRestoreAndWorkDomainNamesToCreate(
            uniqueContacts,
            alreadyCreatedPeople,
            source,
            connectedAccount,
            accountOwner,
          );

        const companiesMap =
          await this.createCompaniesService.createOrRestoreCompanies(
            workDomainNamesToCreate,
            workspaceId,
          );

        const peopleToCreate = this.formatPeopleToCreateFromContacts({
          contactsToCreate: contactsThatNeedPersonCreate,
          createdBy: {
            source: source,
            workspaceMember: accountOwner,
            context: {
              provider: connectedAccount.provider,
            },
          },
          companiesMap,
        });

        const createdPeople = await this.createPersonService.createPeople(
          peopleToCreate,
          workspaceId,
        );

        const peopleToRestore = this.formatPeopleToRestoreFromContacts({
          contactsToRestore: contactsThatNeedPersonRestore,
          companiesMap,
          shouldCreateOrRestorePeopleByHandleMap,
        });

        const restoredPeople = await this.createPersonService.restorePeople(
          peopleToRestore,
          workspaceId,
        );

        await this.createPersonService.enrichPeopleNames(
          peopleToEnrichNames,
          workspaceId,
        );

        return {
          ...createdPeople,
          ...restoredPeople,
          ...createdPeopleFromPhones,
          ...createdPeopleFromExternalHandles,
        };
      },
      authContext,
    );
  }

  async createCompaniesAndPeopleAndUpdateParticipants(
    connectedAccount: ConnectedAccountEntity,
    contactsToCreate: Contact[],
    workspaceId: string,
    source: FieldActorSource,
  ) {
    const contactsBatches = chunk(
      contactsToCreate,
      CONTACTS_CREATION_BATCH_SIZE,
    );

    const authContext = buildSystemAuthContext(workspaceId);

    const userWorkspace = await this.userWorkspaceRepository.findOne({
      where: { id: connectedAccount.userWorkspaceId },
    });

    if (!isDefined(userWorkspace)) {
      this.logger.warn(
        `Skipping contact creation for connected account ${connectedAccount.id} in workspace ${workspaceId}: userWorkspace ${connectedAccount.userWorkspaceId} not found`,
      );

      return;
    }

    const accountOwner =
      await this.globalWorkspaceOrmManager.executeInWorkspaceContext(
        async () => {
          const workspaceMemberRepository =
            await this.globalWorkspaceOrmManager.getRepository(
              workspaceId,
              WorkspaceMemberWorkspaceEntity,
              { shouldBypassPermissionChecks: true },
            );

          return workspaceMemberRepository.findOne({
            where: { userId: userWorkspace.userId },
          });
        },
        authContext,
      );

    for (const contactsBatch of contactsBatches) {
      try {
        await this.createCompaniesAndPeople(
          connectedAccount,
          contactsBatch,
          workspaceId,
          source,
          accountOwner,
        );
      } catch (error) {
        // Concurrent imports for the same workspace can insert the same company
        // domain or person email, and the loser hits the unique index. The
        // record it wanted exists either way.
        if (isDuplicateEntryError(error)) {
          continue;
        }

        this.exceptionHandlerService.captureExceptions([error], {
          workspace: {
            id: workspaceId,
          },
        });
      }
    }
  }

  // An opaque handle has no person field to write it to, so the created person
  // carries nothing but a name and the link back to the conversation is the
  // participant's personId. That link has to be written here: nothing else
  // would ever find this person again.
  private async createPeopleFromExternalContacts({
    externalContacts,
    workspaceId,
    source,
    connectedAccount,
    accountOwner,
  }: {
    externalContacts: Contact[];
    workspaceId: string;
    source: FieldActorSource;
    connectedAccount: ConnectedAccountEntity;
    accountOwner: WorkspaceMemberWorkspaceEntity | null;
  }): Promise<DeepPartial<PersonWorkspaceEntity>[]> {
    // A person with neither a name nor a matchable handle could never be told
    // apart from any other, so an unnamed contact is left unmatched instead.
    const namedContacts = uniqBy(
      externalContacts.filter((contact) =>
        isNonEmptyString(contact.displayName.trim()),
      ),
      (contact) => contact.handle,
    );

    if (namedContacts.length === 0) {
      return [];
    }

    const participantRepository =
      await this.globalWorkspaceOrmManager.getRepository<MessageParticipantWorkspaceEntity>(
        workspaceId,
        'messageParticipant',
        { shouldBypassPermissionChecks: true },
      );

    const personIdByRememberedHandle = await findPersonIdsByRememberedHandles({
      participantRepository,
      handles: namedContacts.map((contact) => contact.handle),
    });

    const personIdByHandle = new Map(personIdByRememberedHandle);

    const peopleToCreate: Partial<PersonWorkspaceEntity>[] = [];

    for (const contact of namedContacts) {
      if (personIdByHandle.has(contact.handle)) {
        continue;
      }

      const { firstName, lastName } = getParsedNameFromDisplayName(
        contact.displayName,
      );

      const personId = v4();

      personIdByHandle.set(contact.handle, personId);

      peopleToCreate.push({
        id: personId,
        name: {
          firstName: capitalize(firstName),
          lastName: capitalize(lastName),
        },
        createdBy: {
          source,
          workspaceMemberId: accountOwner?.id ?? null,
          name: computeDisplayName(accountOwner?.name),
          context: {
            provider: connectedAccount.provider,
          },
        },
      });
    }

    const createdPeople = await this.createPersonService.createPeople(
      peopleToCreate,
      workspaceId,
    );

    await this.linkExternalParticipantsToPeople({
      participantRepository,
      personIdByHandle,
    });

    return createdPeople;
  }

  private async linkExternalParticipantsToPeople({
    participantRepository,
    personIdByHandle,
  }: {
    participantRepository: WorkspaceRepository<MessageParticipantWorkspaceEntity>;
    personIdByHandle: Map<string, string>;
  }): Promise<void> {
    const unlinkedParticipants = await participantRepository.find({
      where: {
        handle: In([...personIdByHandle.keys()]),
        handleKind: MessageHandleKind.EXTERNAL,
        personId: IsNull(),
      },
    });

    const participantsToLink = unlinkedParticipants.flatMap((participant) => {
      const personId = isNonEmptyString(participant.handle)
        ? personIdByHandle.get(participant.handle)
        : undefined;

      return isDefined(personId)
        ? [{ criteria: participant.id, partialEntity: { personId } }]
        : [];
    });

    if (participantsToLink.length === 0) {
      return;
    }

    await participantRepository.updateMany(participantsToLink);
  }

  // Phones get their own pass rather than joining the email pipeline: there is
  // no domain to infer a company from, and the stored phone is split across
  // three columns so neither the lookup nor the write is shaped like an email.
  private async createPeopleFromPhoneContacts({
    phoneContacts,
    personRepository,
    workspaceId,
    source,
    connectedAccount,
    accountOwner,
  }: {
    phoneContacts: Contact[];
    personRepository: WorkspaceRepository<PersonWorkspaceEntity>;
    workspaceId: string;
    source: FieldActorSource;
    connectedAccount: ConnectedAccountEntity;
    accountOwner: WorkspaceMemberWorkspaceEntity | null;
  }): Promise<DeepPartial<PersonWorkspaceEntity>[]> {
    const parsedContacts = phoneContacts.flatMap((contact) => {
      const parsedPhone = parsePhoneHandle(contact.handle);

      return isDefined(parsedPhone) ? [{ contact, parsedPhone }] : [];
    });

    const uniqueParsedContacts = uniqBy(
      parsedContacts,
      ({ parsedPhone }) =>
        `${parsedPhone.callingCode}${parsedPhone.nationalNumber}`,
    );

    if (uniqueParsedContacts.length === 0) {
      return [];
    }

    const alreadyCreatedPeople = await addPersonPhoneFiltersToQueryBuilder({
      queryBuilder: personRepository.createQueryBuilder('person'),
      phones: uniqueParsedContacts.map(({ contact }) => contact.handle),
    })
      .orderBy('person.createdAt', 'ASC')
      .withDeleted()
      .getMany();

    const peopleToCreate: Partial<PersonWorkspaceEntity>[] = [];
    const peopleToRestore: { personId: string; companyId: undefined }[] = [];

    for (const { contact, parsedPhone } of uniqueParsedContacts) {
      const existingPerson = findPersonByPrimaryOrAdditionalPhone({
        people: alreadyCreatedPeople,
        phone: contact.handle,
      });

      if (isDefined(existingPerson)) {
        if (!isNull(existingPerson.deletedAt)) {
          peopleToRestore.push({
            personId: existingPerson.id,
            companyId: undefined,
          });
        }

        continue;
      }

      const { firstName, lastName } = getParsedNameFromDisplayName(
        contact.displayName,
      );

      peopleToCreate.push({
        id: v4(),
        // The country cannot always be inferred from a calling code, and the
        // column is nullable, so the cast stands in for a partial composite.
        phones: {
          primaryPhoneNumber: parsedPhone.nationalNumber,
          primaryPhoneCallingCode: parsedPhone.callingCode,
          primaryPhoneCountryCode: parsedPhone.countryCode,
          additionalPhones: null,
        } as PhonesMetadata,
        name: {
          firstName: capitalize(firstName),
          lastName: capitalize(lastName),
        },
        createdBy: {
          source,
          workspaceMemberId: accountOwner?.id ?? null,
          name: computeDisplayName(accountOwner?.name),
          context: {
            provider: connectedAccount.provider,
          },
        },
      });
    }

    const createdPeople = await this.createPersonService.createPeople(
      peopleToCreate,
      workspaceId,
    );

    const restoredPeople = await this.createPersonService.restorePeople(
      peopleToRestore,
      workspaceId,
    );

    return [...createdPeople, ...restoredPeople];
  }

  computeContactsThatNeedPersonCreateAndRestoreAndWorkDomainNamesToCreate(
    uniqueContacts: Contact[],
    alreadyCreatedPeople: PersonWorkspaceEntity[],
    source: FieldActorSource,
    connectedAccount: ConnectedAccountEntity,
    accountOwner: WorkspaceMemberWorkspaceEntity | null,
  ) {
    const shouldCreateOrRestorePeopleByHandleMap = new Map<
      string,
      { existingPerson: PersonWorkspaceEntity }
    >();

    for (const contact of uniqueContacts) {
      if (!contact.handle.includes('@')) {
        continue;
      }

      const existingPersonOnPrimaryEmail = alreadyCreatedPeople.find(
        (person) => {
          return (
            isNonEmptyString(person.emails?.primaryEmail) &&
            person.emails.primaryEmail.toLowerCase() ===
              contact.handle.toLowerCase()
          );
        },
      );

      if (isDefined(existingPersonOnPrimaryEmail)) {
        shouldCreateOrRestorePeopleByHandleMap.set(
          contact.handle.toLowerCase(),
          {
            existingPerson: existingPersonOnPrimaryEmail,
          },
        );
        continue;
      }

      const existingPersonOnAdditionalEmails = alreadyCreatedPeople.find(
        (person) => {
          return (
            Array.isArray(person.emails?.additionalEmails) &&
            person.emails.additionalEmails.some(
              (email) => email.toLowerCase() === contact.handle.toLowerCase(),
            )
          );
        },
      );

      if (!isDefined(existingPersonOnAdditionalEmails)) continue;

      shouldCreateOrRestorePeopleByHandleMap.set(contact.handle.toLowerCase(), {
        existingPerson: existingPersonOnAdditionalEmails,
      });
    }

    const contactsThatNeedPersonCreate = uniqueContacts.filter(
      (contact) =>
        !shouldCreateOrRestorePeopleByHandleMap.has(
          contact.handle.toLowerCase(),
        ),
    );

    const contactsThatNeedPersonRestore = uniqueContacts.filter((contact) => {
      const existingPerson = shouldCreateOrRestorePeopleByHandleMap.get(
        contact.handle.toLowerCase(),
      )?.existingPerson;

      if (!isDefined(existingPerson)) {
        return false;
      }

      return !isNull(existingPerson.deletedAt);
    });

    const peopleToEnrichNames = this.computePeopleToEnrichNames(
      uniqueContacts,
      shouldCreateOrRestorePeopleByHandleMap,
    );

    const workDomainNamesToCreate = compact(
      [...contactsThatNeedPersonCreate, ...contactsThatNeedPersonRestore]
        .map((contact) => {
          const companyDomainName = isWorkEmail(contact.handle)
            ? getDomainNameFromHandle(contact.handle)
            : undefined;

          if (!isDefined(companyDomainName) || !isWorkDomain(companyDomainName))
            return undefined;

          return {
            domainName: companyDomainName,
            createdBySource: source,
            createdByWorkspaceMember: accountOwner,
            createdByContext: {
              provider: connectedAccount.provider,
            },
          };
        })
        .filter(isDefined),
    );

    return {
      contactsThatNeedPersonCreate,
      contactsThatNeedPersonRestore,
      peopleToEnrichNames,
      workDomainNamesToCreate,
      shouldCreateOrRestorePeopleByHandleMap,
    };
  }

  // Stages per-personId name enrichments for existing People auto-created via
  // CALENDAR or EMAIL. Empty fields are filled from new sources (first
  // non-empty value wins across multiple contacts mapping to the same Person);
  // populated fields are never overwritten.
  private computePeopleToEnrichNames(
    uniqueContacts: Contact[],
    shouldCreateOrRestorePeopleByHandleMap: Map<
      string,
      { existingPerson: PersonWorkspaceEntity }
    >,
  ): { personId: string; name: FullNameMetadata }[] {
    const enrichmentByPersonId = new Map<
      string,
      { firstName: string; lastName: string }
    >();

    for (const contact of uniqueContacts) {
      const existingPerson = shouldCreateOrRestorePeopleByHandleMap.get(
        contact.handle.toLowerCase(),
      )?.existingPerson;

      if (!isDefined(existingPerson)) {
        continue;
      }

      // Soft-deleted matches are restored earlier in the same job, so the
      // enrichment UPDATE runs against an un-deleted row.
      const existingSource = existingPerson.createdBy?.source;

      if (
        existingSource !== FieldActorSource.CALENDAR &&
        existingSource !== FieldActorSource.EMAIL
      ) {
        continue;
      }

      const staged = enrichmentByPersonId.get(existingPerson.id);
      const currentFirstName =
        staged?.firstName ?? existingPerson.name?.firstName ?? '';
      const currentLastName =
        staged?.lastName ?? existingPerson.name?.lastName ?? '';
      const firstNameIsEmpty = !isNonEmptyString(currentFirstName);
      const lastNameIsEmpty = !isNonEmptyString(currentLastName);

      if (!firstNameIsEmpty && !lastNameIsEmpty) {
        continue;
      }

      const { firstName: parsedFirstName, lastName: parsedLastName } =
        getFirstNameAndLastNameFromHandleAndDisplayName(
          contact.handle,
          contact.displayName,
        );

      const enrichedFirstName =
        firstNameIsEmpty && isNonEmptyString(parsedFirstName)
          ? parsedFirstName
          : currentFirstName;
      const enrichedLastName =
        lastNameIsEmpty && isNonEmptyString(parsedLastName)
          ? parsedLastName
          : currentLastName;

      if (
        enrichedFirstName === currentFirstName &&
        enrichedLastName === currentLastName
      ) {
        continue;
      }

      enrichmentByPersonId.set(existingPerson.id, {
        firstName: enrichedFirstName,
        lastName: enrichedLastName,
      });
    }

    return Array.from(enrichmentByPersonId.entries()).map(
      ([personId, name]) => ({ personId, name }),
    );
  }

  formatPeopleToCreateFromContacts({
    contactsToCreate,
    createdBy,
    companiesMap,
  }: {
    contactsToCreate: {
      handle: string;
      displayName: string;
    }[];
    createdBy: {
      source: FieldActorSource;
      workspaceMember?: WorkspaceMemberWorkspaceEntity | null;
      context: {
        provider: ConnectedAccountProvider;
      };
    };
    companiesMap: Record<string, string>;
  }): Partial<PersonWorkspaceEntity>[] {
    return contactsToCreate.map((contact) => {
      const id = v4();

      const { handle, displayName } = contact;

      const { firstName, lastName } =
        getFirstNameAndLastNameFromHandleAndDisplayName(handle, displayName);
      const createdByName = computeDisplayName(createdBy.workspaceMember?.name);

      const companyId = companiesMap[getDomainNameFromHandle(handle)];

      return {
        id,
        emails: {
          primaryEmail: handle.toLowerCase(),
          additionalEmails: null,
        },
        name: {
          firstName,
          lastName,
        },
        companyId,
        createdBy: {
          source: createdBy.source,
          workspaceMemberId: createdBy.workspaceMember?.id ?? null,
          name: createdByName,
          context: createdBy.context,
        },
      };
    });
  }

  formatPeopleToRestoreFromContacts({
    contactsToRestore,
    companiesMap,
    shouldCreateOrRestorePeopleByHandleMap,
  }: {
    contactsToRestore: {
      handle: string;
      displayName: string;
    }[];
    companiesMap: Record<string, string>;
    shouldCreateOrRestorePeopleByHandleMap: Map<
      string,
      { existingPerson: PersonWorkspaceEntity | undefined }
    >;
  }): { personId: string; companyId: string | undefined }[] {
    const peopleToRestore = [];

    for (const contact of contactsToRestore) {
      const { handle } = contact;

      const existingPerson = shouldCreateOrRestorePeopleByHandleMap.get(
        handle.toLowerCase(),
      )?.existingPerson;

      if (!isDefined(existingPerson) || isNull(existingPerson.deletedAt))
        continue;

      const companyId = companiesMap[getDomainNameFromHandle(handle)];

      peopleToRestore.push({
        personId: existingPerson.id,
        companyId,
      });
    }

    return peopleToRestore;
  }
}

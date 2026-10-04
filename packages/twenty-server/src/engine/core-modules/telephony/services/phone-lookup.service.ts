import { Injectable } from '@nestjs/common';

import { type PhoneLookupResult } from 'twenty-shared/application';
import {
  normalizePhoneNumberToE164,
  splitE164PhoneNumber,
} from 'twenty-shared/utils';

import { PHONE_LOOKUP_MAX_CANDIDATES } from 'src/engine/core-modules/telephony/constants/phone-lookup-max-candidates.constant';
import { addPersonPhoneFiltersToQueryBuilder } from 'src/engine/core-modules/telephony/utils/add-person-phone-filters-to-query-builder.util';
import { findPersonPhoneMatches } from 'src/engine/core-modules/telephony/utils/find-person-phone-matches.util';
import { WorkspaceOrmManager } from 'src/engine/twenty-orm/workspace-orm.manager';
import { type PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';

// Read-only by design: it never writes a personId anywhere, unlike the
// participant matcher, so a wrong or ambiguous number cannot erase a link.
@Injectable()
export class PhoneLookupService {
  constructor(private readonly workspaceOrmManager: WorkspaceOrmManager) {}

  async lookupPeople({
    phoneNumber,
    defaultCountryCode,
  }: {
    phoneNumber: string;
    defaultCountryCode?: string;
  }): Promise<PhoneLookupResult> {
    const normalizedDefaultCountryCode = defaultCountryCode?.toUpperCase();

    const normalizedPhoneNumber = normalizePhoneNumberToE164({
      number: phoneNumber,
      defaultCountryCode: normalizedDefaultCountryCode,
    });
    const splitPhoneNumber =
      normalizedPhoneNumber === null
        ? null
        : splitE164PhoneNumber(normalizedPhoneNumber);

    if (normalizedPhoneNumber === null || splitPhoneNumber === null) {
      return {
        normalizedPhoneNumber: null,
        candidates: [],
        isTruncated: false,
      };
    }

    // One row past the cap tells truncation apart from an exact fit.
    const people = await this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        // Context permissions so a lookup made for a viewer only sees the
        // people that viewer may read.
        const personRepository =
          this.workspaceOrmManager.getRepositoryWithContextPermissions<PersonWorkspaceEntity>(
            'person',
          );

        return addPersonPhoneFiltersToQueryBuilder({
          queryBuilder: personRepository.createQueryBuilder('person'),
          phoneNumber: splitPhoneNumber,
        })
          .orderBy('person.createdAt', 'ASC')
          .limit(PHONE_LOOKUP_MAX_CANDIDATES + 1)
          .getMany<PersonWorkspaceEntity>();
      },
    );

    const isTruncated = people.length > PHONE_LOOKUP_MAX_CANDIDATES;

    // Rows written before the transformer normalized numbers may carry
    // formatting, so the E.164 comparison stays as the final word.
    return {
      normalizedPhoneNumber,
      candidates: findPersonPhoneMatches({
        people: people.slice(0, PHONE_LOOKUP_MAX_CANDIDATES),
        normalizedPhoneNumber,
        defaultCountryCode: normalizedDefaultCountryCode,
      }),
      isTruncated,
    };
  }
}

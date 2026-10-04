import { UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { Args, Query } from '@nestjs/graphql';

import { FeatureFlagKey } from 'twenty-shared/types';

import { MetadataResolver } from 'src/engine/api/graphql/graphql-config/decorators/metadata-resolver.decorator';
import { AuthGraphqlApiExceptionFilter } from 'src/engine/core-modules/auth/filters/auth-graphql-api-exception.filter';
import { ResolverValidationPipe } from 'src/engine/core-modules/graphql/pipes/resolver-validation.pipe';
import { PhoneLookupInput } from 'src/engine/core-modules/telephony/dtos/phone-lookup.input';
import { PhoneLookupResultDTO } from 'src/engine/core-modules/telephony/dtos/phone-lookup-result.dto';
import { PhoneLookupService } from 'src/engine/core-modules/telephony/services/phone-lookup.service';
import { AuthPrincipalGuard } from 'src/engine/guards/auth-principal.guard';
import { CustomPermissionGuard } from 'src/engine/guards/custom-permission.guard';
import {
  FeatureFlagGuard,
  RequireFeatureFlag,
} from 'src/engine/guards/feature-flag.guard';
import { PermissionsGraphqlApiExceptionFilter } from 'src/engine/metadata-modules/permissions/utils/permissions-graphql-api-exception.filter';

@UseGuards(
  AuthPrincipalGuard({
    userSession: {
      standard: true,
      impersonated: true,
      playground: true,
      workspaceAgnostic: false,
    },
    apiKey: true,
    oauthClient: true,
    application: true,
  }),
  FeatureFlagGuard,
  // Record permissions are enforced by the repository the lookup reads from.
  CustomPermissionGuard,
)
@MetadataResolver()
@UseFilters(PermissionsGraphqlApiExceptionFilter, AuthGraphqlApiExceptionFilter)
@UsePipes(ResolverValidationPipe)
export class PhoneLookupResolver {
  constructor(private readonly phoneLookupService: PhoneLookupService) {}

  @Query(() => PhoneLookupResultDTO)
  @RequireFeatureFlag(FeatureFlagKey.IS_TELEPHONY_ENABLED)
  async lookupPeopleByPhoneNumber(
    @Args('input') input: PhoneLookupInput,
  ): Promise<PhoneLookupResultDTO> {
    return this.phoneLookupService.lookupPeople({
      phoneNumber: input.phoneNumber,
      defaultCountryCode: input.defaultCountryCode,
    });
  }
}

import { Module } from '@nestjs/common';

import { FeatureFlagModule } from 'src/engine/core-modules/feature-flag/feature-flag.module';
import { PhoneLookupResolver } from 'src/engine/core-modules/telephony/resolvers/phone-lookup.resolver';
import { PhoneLookupService } from 'src/engine/core-modules/telephony/services/phone-lookup.service';

@Module({
  imports: [FeatureFlagModule],
  providers: [PhoneLookupService, PhoneLookupResolver],
  exports: [PhoneLookupService],
})
export class TelephonyModule {}

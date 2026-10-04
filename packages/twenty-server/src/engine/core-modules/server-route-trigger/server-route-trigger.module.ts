import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApplicationRegistrationVariableEntity } from 'src/engine/core-modules/application/application-registration-variable/application-registration-variable.entity';
import { LogicFunctionExecutorModule } from 'src/engine/core-modules/logic-function/logic-function-executor/logic-function-executor.module';
import { SecretEncryptionModule } from 'src/engine/core-modules/secret-encryption/secret-encryption.module';
import { ServerRouteTriggerController } from 'src/engine/core-modules/server-route-trigger/server-route-trigger.controller';
import { ServerRouteTriggerService } from 'src/engine/core-modules/server-route-trigger/server-route-trigger.service';
import { LogicFunctionEntity } from 'src/engine/metadata-modules/logic-function/logic-function.entity';
import { provideWorkspaceScopedRepository } from 'src/engine/twenty-orm/workspace-scoped-repository/provide-workspace-scoped-repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LogicFunctionEntity,
      ApplicationRegistrationVariableEntity,
    ]),
    LogicFunctionExecutorModule,
    SecretEncryptionModule,
  ],
  controllers: [ServerRouteTriggerController],
  providers: [
    provideWorkspaceScopedRepository(LogicFunctionEntity),
    ServerRouteTriggerService,
  ],
})
export class ServerRouteTriggerModule {}

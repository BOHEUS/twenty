import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApplicationDependencyService } from 'src/engine/core-modules/application/application-dependency/application-dependency.service';
import { ApplicationRegistrationEntity } from 'src/engine/core-modules/application/application-registration/application-registration.entity';
import { ApplicationEntity } from 'src/engine/core-modules/application/application.entity';
import { provideWorkspaceScopedRepository } from 'src/engine/twenty-orm/workspace-scoped-repository/provide-workspace-scoped-repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ApplicationEntity,
      ApplicationRegistrationEntity,
    ]),
  ],
  providers: [
    ApplicationDependencyService,
    provideWorkspaceScopedRepository(ApplicationEntity),
  ],
  exports: [ApplicationDependencyService],
})
export class ApplicationDependencyModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FileStorageModule } from 'src/engine/core-modules/file-storage/file-storage.module';
import { ObjectMetadataModule } from 'src/engine/metadata-modules/object-metadata/object-metadata.module';
import { TwentyORMModule } from 'src/engine/twenty-orm/twenty-orm.module';

import { RecordExportEntity } from './entities/record-export.entity';
import { RecordExportJob } from './jobs/record-export.job';
import { RecordExportService } from './services/record-export.service';
import { RecordExportResolver } from './resolvers/record-export.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([RecordExportEntity]),
    FileStorageModule,
    ObjectMetadataModule,
    TwentyORMModule,
  ],
  providers: [RecordExportJob, RecordExportService, RecordExportResolver],
  exports: [RecordExportService],
})
export class RecordExportModule {}

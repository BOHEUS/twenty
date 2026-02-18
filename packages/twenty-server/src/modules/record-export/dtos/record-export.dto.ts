import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';

import { RecordExportStatus } from 'src/modules/record-export/types/record-export-job.types';

registerEnumType(RecordExportStatus, { name: 'RecordExportStatus' });

@ObjectType('RecordExport')
export class RecordExportDTO {
  @Field()
  id: string;

  @Field()
  objectNameSingular: string;

  @Field(() => RecordExportStatus)
  status: RecordExportStatus;

  @Field({ nullable: true })
  downloadUrl?: string;

  @Field({ nullable: true })
  errorMessage?: string;

  @Field(() => Int)
  totalRecordCount: number;

  @Field(() => Int)
  processedRecordCount: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

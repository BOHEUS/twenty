import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { RecordExportStatus } from 'src/modules/record-export/types/record-export-job.types';

@Entity('recordExport')
export class RecordExportEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  workspaceId: string;

  @Column()
  objectNameSingular: string;

  @Column({
    type: 'enum',
    enum: RecordExportStatus,
    default: RecordExportStatus.PENDING,
  })
  status: RecordExportStatus;

  @Column({ nullable: true })
  downloadUrl?: string;

  @Column({ nullable: true })
  errorMessage?: string;

  @Column({ type: 'int', default: 0 })
  totalRecordCount: number;

  @Column({ type: 'int', default: 0 })
  processedRecordCount: number;

  @Column({ type: 'jsonb', nullable: true })
  filter?: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  orderBy?: Record<string, any>;

  @Column('text', { array: true, nullable: true })
  fieldNames?: string[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}

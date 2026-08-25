import { QueryRunner } from 'typeorm';

import { RegisteredInstanceCommand } from 'src/engine/core-modules/upgrade/decorators/registered-instance-command.decorator';
import { FastInstanceCommand } from 'src/engine/core-modules/upgrade/interfaces/fast-instance-command.interface';

@RegisteredInstanceCommand('2.34.0', 1787706420000)
export class AddAppConnectionAndChatColumnsFastInstanceCommand
  implements FastInstanceCommand
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "core"."connectionProvider" ADD "apiKeyConfig" jsonb',
    );
    await queryRunner.query(
      'ALTER TABLE "core"."connectedAccount" ADD "apiKeyParameters" jsonb',
    );
    await queryRunner.query(
      'ALTER TABLE "core"."connectionProvider" ADD "onSendMessageLogicFunctionUniversalIdentifier" uuid',
    );
    await queryRunner.query(
      'ALTER TABLE "core"."messageChannel" ADD "handleKind" character varying',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "core"."messageChannel" DROP COLUMN "handleKind"',
    );
    await queryRunner.query(
      'ALTER TABLE "core"."connectionProvider" DROP COLUMN "onSendMessageLogicFunctionUniversalIdentifier"',
    );
    await queryRunner.query(
      'ALTER TABLE "core"."connectedAccount" DROP COLUMN "apiKeyParameters"',
    );
    await queryRunner.query(
      'ALTER TABLE "core"."connectionProvider" DROP COLUMN "apiKeyConfig"',
    );
  }
}

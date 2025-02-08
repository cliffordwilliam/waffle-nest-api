import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRole1739040529996 implements MigrationInterface {
  name = 'AddRole1739040529996';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "role" character varying NOT NULL DEFAULT 'regular'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`);
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFlavorToWaffle1739001357203 implements MigrationInterface {
  name = 'AddFlavorToWaffle1739001357203';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "waffle" ADD "flavor" character varying(50)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "waffle" DROP COLUMN "flavor"`);
  }
}

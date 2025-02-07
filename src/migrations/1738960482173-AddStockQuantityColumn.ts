import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStockQuantityColumn1738960482173 implements MigrationInterface {
  name = 'AddStockQuantityColumn1738960482173';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "waffle" ADD "stockQuantity" integer NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "waffle" DROP COLUMN "stockQuantity"`);
  }
}

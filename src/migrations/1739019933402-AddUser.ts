import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUser1739019933402 implements MigrationInterface {
  name = 'AddUser1739019933402';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4055eff5e932e76b0be87a5ae6" ON "waffle" ("name") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4055eff5e932e76b0be87a5ae6"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
  }
}

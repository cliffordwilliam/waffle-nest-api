import { MigrationInterface, QueryRunner } from "typeorm";

export class YourMigrationName1738953751584 implements MigrationInterface {
    name = 'YourMigrationName1738953751584'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "waffle" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, "description" character varying(255), "price" numeric(10,2) NOT NULL, "isGlutenFree" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_227abbd3921d81ef5659815bba2" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "waffle"`);
    }

}

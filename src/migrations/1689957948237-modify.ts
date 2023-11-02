import { MigrationInterface, QueryRunner } from "typeorm";

export class Modify1689957948237 implements MigrationInterface {
    name = 'Modify1689957948237'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`history\` DROP FOREIGN KEY \`FK_000464e67a2febed5a1ec55a42c\``);
        await queryRunner.query(`ALTER TABLE \`history\` DROP COLUMN \`storyId\``);
        await queryRunner.query(`ALTER TABLE \`story\` ADD \`avatar\` varchar(500) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`story\` DROP COLUMN \`avatar\``);
        await queryRunner.query(`ALTER TABLE \`history\` ADD \`storyId\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`history\` ADD CONSTRAINT \`FK_000464e67a2febed5a1ec55a42c\` FOREIGN KEY (\`storyId\`) REFERENCES \`story\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

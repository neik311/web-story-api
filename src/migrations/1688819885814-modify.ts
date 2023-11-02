import { MigrationInterface, QueryRunner } from "typeorm";

export class Modify1688819885814 implements MigrationInterface {
    name = 'Modify1688819885814'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`chapter\` ADD CONSTRAINT \`FK_032f36b55436efe49e6775b4898\` FOREIGN KEY (\`storyId\`) REFERENCES \`story\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`chapter\` DROP FOREIGN KEY \`FK_032f36b55436efe49e6775b4898\``);
    }

}

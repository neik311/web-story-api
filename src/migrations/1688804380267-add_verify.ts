import { MigrationInterface, QueryRunner } from "typeorm";

export class AddVerify1688804380267 implements MigrationInterface {
    name = 'AddVerify1688804380267'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`verify\` (\`id\` varchar(36) NOT NULL, \`email\` varchar(250) NOT NULL, \`code\` varchar(50) NOT NULL, \`timeStart\` datetime NOT NULL, \`timeExpired\` datetime NOT NULL, \`type\` varchar(50) NOT NULL, \`description\` varchar(500) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`verify\``);
    }

}

import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddNotifyMessage1695543483732 implements MigrationInterface {
  name = 'AddNotifyMessage1695543483732'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`message\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime NOT NULL, \`createdBy\` varchar(36) NOT NULL, \`updatedAt\` datetime NULL, \`updatedBy\` varchar(36) NULL, \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`userId\` varchar(36) NOT NULL, \`content\` varchar(500) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `CREATE TABLE \`notify\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime NOT NULL, \`createdBy\` varchar(36) NOT NULL, \`updatedAt\` datetime NULL, \`updatedBy\` varchar(36) NULL, \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`userId\` varchar(36) NOT NULL, \`content\` varchar(500) NULL, \`watched\` tinyint NOT NULL DEFAULT 0, \`url\` varchar(500) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(`ALTER TABLE \`comment\` ADD \`chapterId\` varchar(36) NULL`)
    await queryRunner.query(
      `ALTER TABLE \`message\` ADD CONSTRAINT \`FK_446251f8ceb2132af01b68eb593\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`notify\` ADD CONSTRAINT \`FK_7e728820acd8818fe9638791bcf\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_ded13a43b98c25920cbfb665e5e\` FOREIGN KEY (\`chapterId\`) REFERENCES \`chapter\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_ded13a43b98c25920cbfb665e5e\``)
    await queryRunner.query(`ALTER TABLE \`notify\` DROP FOREIGN KEY \`FK_7e728820acd8818fe9638791bcf\``)
    await queryRunner.query(`ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_446251f8ceb2132af01b68eb593\``)
    await queryRunner.query(`ALTER TABLE \`comment\` DROP COLUMN \`chapterId\``)
    await queryRunner.query(`DROP TABLE \`notify\``)
    await queryRunner.query(`DROP TABLE \`message\``)
  }
}

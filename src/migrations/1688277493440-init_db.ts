import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDb1688277493440 implements MigrationInterface {
    name = 'InitDb1688277493440'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime NOT NULL, \`createdBy\` varchar(36) NOT NULL, \`updatedAt\` datetime NULL, \`updatedBy\` varchar(36) NULL, \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`username\` varchar(50) NOT NULL, \`email\` varchar(250) NOT NULL, \`password\` text NOT NULL, \`avatar\` varchar(500) NULL, \`verified\` tinyint NOT NULL DEFAULT 0, \`roleId\` varchar(50) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`story\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime NOT NULL, \`createdBy\` varchar(36) NOT NULL, \`updatedAt\` datetime NULL, \`updatedBy\` varchar(36) NULL, \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`name\` varchar(250) NOT NULL, \`otherName\` varchar(250) NULL, \`author\` varchar(250) NULL, \`content\` text NULL, \`finished\` tinyint NULL DEFAULT 0, \`type\` varchar(50) NOT NULL DEFAULT 'word', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`chapter\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime NOT NULL, \`createdBy\` varchar(36) NOT NULL, \`updatedAt\` datetime NULL, \`updatedBy\` varchar(36) NULL, \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`chapterNumber\` float NOT NULL, \`name\` varchar(250) NULL, \`content\` text NULL, \`viewCount\` int NULL DEFAULT '0', \`storyId\` varchar(36) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`history\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime NOT NULL, \`createdBy\` varchar(36) NOT NULL, \`updatedAt\` datetime NULL, \`updatedBy\` varchar(36) NULL, \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`storyId\` varchar(36) NOT NULL, \`userId\` varchar(36) NOT NULL, \`chapterId\` varchar(36) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`favorite\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime NOT NULL, \`createdBy\` varchar(36) NOT NULL, \`updatedAt\` datetime NULL, \`updatedBy\` varchar(36) NULL, \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`storyId\` varchar(36) NOT NULL, \`userId\` varchar(36) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`role\` (\`id\` varchar(36) NOT NULL, \`code\` varchar(50) NOT NULL, \`name\` varchar(100) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`category\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime NOT NULL, \`createdBy\` varchar(36) NOT NULL, \`updatedAt\` datetime NULL, \`updatedBy\` varchar(36) NULL, \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`name\` varchar(250) NOT NULL, \`description\` varchar(500) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`category_story\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime NOT NULL, \`createdBy\` varchar(36) NOT NULL, \`updatedAt\` datetime NULL, \`updatedBy\` varchar(36) NULL, \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`storyId\` varchar(36) NOT NULL, \`categoryId\` varchar(36) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`comment\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime NOT NULL, \`createdBy\` varchar(36) NOT NULL, \`updatedAt\` datetime NULL, \`updatedBy\` varchar(36) NULL, \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`storyId\` varchar(36) NOT NULL, \`userId\` varchar(36) NOT NULL, \`content\` varchar(500) NULL, \`parentId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_c28e52f758e7bbc53828db92194\` FOREIGN KEY (\`roleId\`) REFERENCES \`role\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`history\` ADD CONSTRAINT \`FK_000464e67a2febed5a1ec55a42c\` FOREIGN KEY (\`storyId\`) REFERENCES \`story\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`history\` ADD CONSTRAINT \`FK_7d339708f0fa8446e3c4128dea9\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`history\` ADD CONSTRAINT \`FK_7174903aa26e4aa65ec60e6de78\` FOREIGN KEY (\`chapterId\`) REFERENCES \`chapter\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`favorite\` ADD CONSTRAINT \`FK_b9558ee4bdc56ac6e4a66ac592c\` FOREIGN KEY (\`storyId\`) REFERENCES \`story\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`favorite\` ADD CONSTRAINT \`FK_83b775fdebbe24c29b2b5831f2d\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`category_story\` ADD CONSTRAINT \`FK_cb68a09380e790a25e122b1e0f1\` FOREIGN KEY (\`storyId\`) REFERENCES \`story\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`category_story\` ADD CONSTRAINT \`FK_815f88dfe316d3d3d284c9d9bc6\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_fe13edd1431a248a0eeac11ae43\` FOREIGN KEY (\`storyId\`) REFERENCES \`story\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_c0354a9a009d3bb45a08655ce3b\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_e3aebe2bd1c53467a07109be596\` FOREIGN KEY (\`parentId\`) REFERENCES \`comment\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_e3aebe2bd1c53467a07109be596\``);
        await queryRunner.query(`ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_c0354a9a009d3bb45a08655ce3b\``);
        await queryRunner.query(`ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_fe13edd1431a248a0eeac11ae43\``);
        await queryRunner.query(`ALTER TABLE \`category_story\` DROP FOREIGN KEY \`FK_815f88dfe316d3d3d284c9d9bc6\``);
        await queryRunner.query(`ALTER TABLE \`category_story\` DROP FOREIGN KEY \`FK_cb68a09380e790a25e122b1e0f1\``);
        await queryRunner.query(`ALTER TABLE \`favorite\` DROP FOREIGN KEY \`FK_83b775fdebbe24c29b2b5831f2d\``);
        await queryRunner.query(`ALTER TABLE \`favorite\` DROP FOREIGN KEY \`FK_b9558ee4bdc56ac6e4a66ac592c\``);
        await queryRunner.query(`ALTER TABLE \`history\` DROP FOREIGN KEY \`FK_7174903aa26e4aa65ec60e6de78\``);
        await queryRunner.query(`ALTER TABLE \`history\` DROP FOREIGN KEY \`FK_7d339708f0fa8446e3c4128dea9\``);
        await queryRunner.query(`ALTER TABLE \`history\` DROP FOREIGN KEY \`FK_000464e67a2febed5a1ec55a42c\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_c28e52f758e7bbc53828db92194\``);
        await queryRunner.query(`DROP TABLE \`comment\``);
        await queryRunner.query(`DROP TABLE \`category_story\``);
        await queryRunner.query(`DROP TABLE \`category\``);
        await queryRunner.query(`DROP TABLE \`role\``);
        await queryRunner.query(`DROP TABLE \`favorite\``);
        await queryRunner.query(`DROP TABLE \`history\``);
        await queryRunner.query(`DROP TABLE \`chapter\``);
        await queryRunner.query(`DROP TABLE \`story\``);
        await queryRunner.query(`DROP TABLE \`user\``);
    }

}

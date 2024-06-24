import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1719239205029 implements MigrationInterface {
    name = 'Init1719239205029'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`controls\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`status\` varchar(30) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(200) NOT NULL, \`description\` varchar(200) NOT NULL, \`code\` varchar(10) NOT NULL, \`id_control_group\` bigint NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`assessment\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`status\` varchar(30) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id_audit\` bigint NOT NULL, \`id_group_control\` int NOT NULL, \`version\` int NOT NULL, \`accordance\` text NULL, \`disagreement\` text NULL, \`acceptance_level\` int NOT NULL, \`control_group_id\` bigint NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`control_groups\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`status\` varchar(30) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`objective\` varchar(200) NOT NULL, \`objective_description\` varchar(200) NOT NULL, \`objective_code\` varchar(10) NOT NULL, \`group\` varchar(200) NOT NULL, \`group_description\` varchar(200) NOT NULL, \`group_code\` varchar(10) NOT NULL, \`id_template\` bigint NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`template\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`status\` varchar(30) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(100) NOT NULL, \`description\` varchar(100) NOT NULL, \`version\` varchar(10) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`maturity_levels\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`status\` varchar(30) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(100) NOT NULL COMMENT 'Level name', \`grade\` int NOT NULL COMMENT 'Level grade', \`description\` varchar(200) NULL COMMENT 'Level description', UNIQUE INDEX \`IDX_a4b47a562023b2fd2fb8a6affb\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`audits\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`status\` varchar(30) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`objective\` varchar(200) NOT NULL, \`description\` varchar(200) NOT NULL, \`begin_date\` datetime NULL, \`final_date\` datetime NULL, \`id_template\` bigint NOT NULL, \`id_client\` varchar(255) NOT NULL, \`id_level\` bigint NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user-audit\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`status\` varchar(30) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id_audit\` bigint NOT NULL, \`id_user\` bigint NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`parameters\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`status\` varchar(30) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`code\` varchar(15) NOT NULL COMMENT 'Código de parámetro', \`name\` varchar(50) NOT NULL COMMENT 'Nombre de parámetro', \`group\` varchar(15) NOT NULL COMMENT 'Grupo de parámetro', \`description\` varchar(255) NOT NULL COMMENT 'Descripción de parámetro', UNIQUE INDEX \`IDX_f9bdd410abefd57f573ec1bf9e\` (\`code\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`controls\` ADD CONSTRAINT \`FK_06f2d151f70615cf9d5e873a4d0\` FOREIGN KEY (\`id_control_group\`) REFERENCES \`control_groups\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`assessment\` ADD CONSTRAINT \`FK_8737efc591bdededaef14ce4095\` FOREIGN KEY (\`id_audit\`) REFERENCES \`audits\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`assessment\` ADD CONSTRAINT \`FK_017006870828c92e6581e823cae\` FOREIGN KEY (\`control_group_id\`) REFERENCES \`control_groups\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`control_groups\` ADD CONSTRAINT \`FK_6eb66b4466d136f6cb08565c14d\` FOREIGN KEY (\`id_template\`) REFERENCES \`template\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`audits\` ADD CONSTRAINT \`FK_acd5eeac90e00903b9b53298dc8\` FOREIGN KEY (\`id_template\`) REFERENCES \`template\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`audits\` ADD CONSTRAINT \`FK_75815d96a3c33cd4f690b2b1fa1\` FOREIGN KEY (\`id_level\`) REFERENCES \`maturity_levels\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user-audit\` ADD CONSTRAINT \`FK_1eed50a9e3f67e2896d2ccf873a\` FOREIGN KEY (\`id_audit\`) REFERENCES \`audits\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user-audit\` DROP FOREIGN KEY \`FK_1eed50a9e3f67e2896d2ccf873a\``);
        await queryRunner.query(`ALTER TABLE \`audits\` DROP FOREIGN KEY \`FK_75815d96a3c33cd4f690b2b1fa1\``);
        await queryRunner.query(`ALTER TABLE \`audits\` DROP FOREIGN KEY \`FK_acd5eeac90e00903b9b53298dc8\``);
        await queryRunner.query(`ALTER TABLE \`control_groups\` DROP FOREIGN KEY \`FK_6eb66b4466d136f6cb08565c14d\``);
        await queryRunner.query(`ALTER TABLE \`assessment\` DROP FOREIGN KEY \`FK_017006870828c92e6581e823cae\``);
        await queryRunner.query(`ALTER TABLE \`assessment\` DROP FOREIGN KEY \`FK_8737efc591bdededaef14ce4095\``);
        await queryRunner.query(`ALTER TABLE \`controls\` DROP FOREIGN KEY \`FK_06f2d151f70615cf9d5e873a4d0\``);
        await queryRunner.query(`DROP INDEX \`IDX_f9bdd410abefd57f573ec1bf9e\` ON \`parameters\``);
        await queryRunner.query(`DROP TABLE \`parameters\``);
        await queryRunner.query(`DROP TABLE \`user-audit\``);
        await queryRunner.query(`DROP TABLE \`audits\``);
        await queryRunner.query(`DROP INDEX \`IDX_a4b47a562023b2fd2fb8a6affb\` ON \`maturity_levels\``);
        await queryRunner.query(`DROP TABLE \`maturity_levels\``);
        await queryRunner.query(`DROP TABLE \`template\``);
        await queryRunner.query(`DROP TABLE \`control_groups\``);
        await queryRunner.query(`DROP TABLE \`assessment\``);
        await queryRunner.query(`DROP TABLE \`controls\``);
    }

}

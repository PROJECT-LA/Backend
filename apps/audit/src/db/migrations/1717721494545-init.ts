import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1717721494545 implements MigrationInterface {
    name = 'Init1717721494545'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`controls\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`status\` varchar(30) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`o_control\` varchar(200) NOT NULL, \`o_control_description\` varchar(200) NOT NULL, \`o_control_code\` varchar(5) NOT NULL, \`g_control\` varchar(200) NOT NULL, \`g_control_description\` varchar(200) NOT NULL, \`g_control_code\` varchar(5) NOT NULL, \`e_control\` varchar(200) NOT NULL, \`e_control_description\` varchar(200) NOT NULL, \`e_control_code\` varchar(5) NOT NULL, \`id_template\` bigint NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`template\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`status\` varchar(30) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(100) NOT NULL, \`description\` varchar(100) NOT NULL, \`version\` varchar(10) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`audits\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`status\` varchar(30) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id_client\` bigint NOT NULL, \`object\` varchar(200) NOT NULL, \`description\` varchar(200) NOT NULL, \`date_begin\` date NOT NULL, \`date_end\` date NULL, \`id_template\` bigint NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`seguimiento\` (\`id_seguimiento\` int NOT NULL AUTO_INCREMENT, \`id_audit\` bigint NULL, \`id_template\` bigint NULL, \`id_control\` bigint NULL, PRIMARY KEY (\`id_seguimiento\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`parameters\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`status\` varchar(30) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`code\` varchar(15) NOT NULL COMMENT 'Código de parámetro', \`name\` varchar(50) NOT NULL COMMENT 'Nombre de parámetro', \`group\` varchar(15) NOT NULL COMMENT 'Grupo de parámetro', \`description\` varchar(255) NOT NULL COMMENT 'Descripción de parámetro', UNIQUE INDEX \`IDX_f9bdd410abefd57f573ec1bf9e\` (\`code\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`maturity_levels\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`status\` varchar(30) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`level\` int NOT NULL, \`description\` varchar(200) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`controls\` ADD CONSTRAINT \`FK_12632291582adefcc1ddaedd945\` FOREIGN KEY (\`id_template\`) REFERENCES \`template\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`audits\` ADD CONSTRAINT \`FK_acd5eeac90e00903b9b53298dc8\` FOREIGN KEY (\`id_template\`) REFERENCES \`template\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`seguimiento\` ADD CONSTRAINT \`FK_756f6bd824087e0bca6fac49d77\` FOREIGN KEY (\`id_audit\`) REFERENCES \`audits\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`seguimiento\` ADD CONSTRAINT \`FK_c5eecd2132188e81e5c99948e7e\` FOREIGN KEY (\`id_template\`) REFERENCES \`template\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`seguimiento\` ADD CONSTRAINT \`FK_aa4be237d2bb5b6d6f20f01b48e\` FOREIGN KEY (\`id_control\`) REFERENCES \`controls\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`seguimiento\` DROP FOREIGN KEY \`FK_aa4be237d2bb5b6d6f20f01b48e\``);
        await queryRunner.query(`ALTER TABLE \`seguimiento\` DROP FOREIGN KEY \`FK_c5eecd2132188e81e5c99948e7e\``);
        await queryRunner.query(`ALTER TABLE \`seguimiento\` DROP FOREIGN KEY \`FK_756f6bd824087e0bca6fac49d77\``);
        await queryRunner.query(`ALTER TABLE \`audits\` DROP FOREIGN KEY \`FK_acd5eeac90e00903b9b53298dc8\``);
        await queryRunner.query(`ALTER TABLE \`controls\` DROP FOREIGN KEY \`FK_12632291582adefcc1ddaedd945\``);
        await queryRunner.query(`DROP TABLE \`maturity_levels\``);
        await queryRunner.query(`DROP INDEX \`IDX_f9bdd410abefd57f573ec1bf9e\` ON \`parameters\``);
        await queryRunner.query(`DROP TABLE \`parameters\``);
        await queryRunner.query(`DROP TABLE \`seguimiento\``);
        await queryRunner.query(`DROP TABLE \`audits\``);
        await queryRunner.query(`DROP TABLE \`template\``);
        await queryRunner.query(`DROP TABLE \`controls\``);
    }

}

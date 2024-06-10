import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1717989643141 implements MigrationInterface {
    name = 'Init1717989643141'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`controls\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`status\` varchar(30) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(200) NOT NULL, \`description\` varchar(200) NOT NULL, \`code\` varchar(5) NOT NULL, \`id_control_group\` bigint NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`control_groups\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`status\` varchar(30) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`objective\` varchar(200) NOT NULL, \`objective_description\` varchar(200) NOT NULL, \`objective_code\` varchar(5) NOT NULL, \`group\` varchar(200) NOT NULL, \`group_description\` varchar(200) NOT NULL, \`group_code\` varchar(5) NOT NULL, \`id_template\` bigint NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`template\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`status\` varchar(30) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(100) NOT NULL, \`description\` varchar(100) NOT NULL, \`version\` varchar(10) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`parameters\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`status\` varchar(30) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`code\` varchar(15) NOT NULL COMMENT 'Código de parámetro', \`name\` varchar(50) NOT NULL COMMENT 'Nombre de parámetro', \`group\` varchar(15) NOT NULL COMMENT 'Grupo de parámetro', \`description\` varchar(255) NOT NULL COMMENT 'Descripción de parámetro', UNIQUE INDEX \`IDX_f9bdd410abefd57f573ec1bf9e\` (\`code\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`maturity_levels\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`status\` varchar(30) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`level\` int NOT NULL, \`description\` varchar(200) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`controls\` ADD CONSTRAINT \`FK_06f2d151f70615cf9d5e873a4d0\` FOREIGN KEY (\`id_control_group\`) REFERENCES \`control_groups\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`control_groups\` ADD CONSTRAINT \`FK_6eb66b4466d136f6cb08565c14d\` FOREIGN KEY (\`id_template\`) REFERENCES \`template\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`control_groups\` DROP FOREIGN KEY \`FK_6eb66b4466d136f6cb08565c14d\``);
        await queryRunner.query(`ALTER TABLE \`controls\` DROP FOREIGN KEY \`FK_06f2d151f70615cf9d5e873a4d0\``);
        await queryRunner.query(`DROP TABLE \`maturity_levels\``);
        await queryRunner.query(`DROP INDEX \`IDX_f9bdd410abefd57f573ec1bf9e\` ON \`parameters\``);
        await queryRunner.query(`DROP TABLE \`parameters\``);
        await queryRunner.query(`DROP TABLE \`template\``);
        await queryRunner.query(`DROP TABLE \`control_groups\``);
        await queryRunner.query(`DROP TABLE \`controls\``);
    }

}

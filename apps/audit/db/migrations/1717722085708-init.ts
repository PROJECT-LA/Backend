import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1717722085708 implements MigrationInterface {
    name = 'Init1717722085708'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`controls\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`status\` varchar(30) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`o_control\` varchar(200) NOT NULL, \`o_control_description\` varchar(200) NOT NULL, \`o_control_code\` varchar(5) NOT NULL, \`g_control\` varchar(200) NOT NULL, \`g_control_description\` varchar(200) NOT NULL, \`g_control_code\` varchar(5) NOT NULL, \`e_control\` varchar(200) NOT NULL, \`e_control_description\` varchar(200) NOT NULL, \`e_control_code\` varchar(5) NOT NULL, \`id_template\` bigint NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`template\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`status\` varchar(30) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(100) NOT NULL, \`description\` varchar(100) NOT NULL, \`version\` varchar(10) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`parameters\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`status\` varchar(30) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`code\` varchar(15) NOT NULL COMMENT 'Código de parámetro', \`name\` varchar(50) NOT NULL COMMENT 'Nombre de parámetro', \`group\` varchar(15) NOT NULL COMMENT 'Grupo de parámetro', \`description\` varchar(255) NOT NULL COMMENT 'Descripción de parámetro', UNIQUE INDEX \`IDX_f9bdd410abefd57f573ec1bf9e\` (\`code\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`maturity_levels\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`status\` varchar(30) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`level\` int NOT NULL, \`description\` varchar(200) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`controls\` ADD CONSTRAINT \`FK_12632291582adefcc1ddaedd945\` FOREIGN KEY (\`id_template\`) REFERENCES \`template\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`controls\` DROP FOREIGN KEY \`FK_12632291582adefcc1ddaedd945\``);
        await queryRunner.query(`DROP TABLE \`maturity_levels\``);
        await queryRunner.query(`DROP INDEX \`IDX_f9bdd410abefd57f573ec1bf9e\` ON \`parameters\``);
        await queryRunner.query(`DROP TABLE \`parameters\``);
        await queryRunner.query(`DROP TABLE \`template\``);
        await queryRunner.query(`DROP TABLE \`controls\``);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1714971192378 implements MigrationInterface {
    name = 'Init1714971192378'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`roles\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`status\` varchar(30) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_648e3f5447f725579d7d4ffdfb\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`status\` varchar(30) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`names\` varchar(255) NOT NULL, \`last_names\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`phone\` varchar(255) NULL, \`username\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`modules\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`status\` varchar(30) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`label\` varchar(50) NOT NULL COMMENT 'Etiqueta del módulo para el Sidebar del proyecto', \`url\` varchar(50) NOT NULL COMMENT 'Ruta para acceder al módulo', \`name\` varchar(50) NOT NULL COMMENT 'Nombre del módulo', \`icon\` varchar(50) NULL COMMENT 'Icono del modulo', \`description\` varchar(50) NOT NULL COMMENT 'Descripcion del modulo', \`order\` int NOT NULL COMMENT 'Ruta para acceder al módulo', \`id_modulo\` bigint NULL COMMENT 'Clave foránea que índica que pertenece a otro módulo', \`id_module\` bigint NULL, UNIQUE INDEX \`IDX_b32d2596a6c578bf737e151747\` (\`url\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`casbin_rule\` (\`id\` int NOT NULL AUTO_INCREMENT COMMENT 'Clave primaria de la tabla CasbinRule', \`ptype\` varchar(255) NULL COMMENT 'Tipo de política (p,g)', \`v0\` varchar(255) NULL COMMENT 'Regla de acceso (roles)', \`v1\` varchar(255) NULL COMMENT 'Regla de acceso (rutas)', \`v2\` varchar(255) NULL COMMENT 'Regla de acceso (GET, POST, PATCH, DELETE para backend y read, update, create y delete para frontend)', \`v3\` varchar(255) NULL COMMENT 'Regla de acceso (Backend, Frontend)', \`v4\` varchar(255) NULL COMMENT 'Regla de acceso', \`v5\` varchar(255) NULL COMMENT 'Regla de acceso', \`v6\` varchar(255) NULL COMMENT 'Regla de acceso', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`parameters\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`status\` varchar(30) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`code\` varchar(15) NOT NULL COMMENT 'Código de parámetro', \`name\` varchar(50) NOT NULL COMMENT 'Nombre de parámetro', \`group\` varchar(15) NOT NULL COMMENT 'Grupo de parámetro', \`description\` varchar(255) NOT NULL COMMENT 'Descripción de parámetro', UNIQUE INDEX \`IDX_f9bdd410abefd57f573ec1bf9e\` (\`code\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_roles\` (\`users_id\` bigint NOT NULL, \`roles_id\` bigint NOT NULL, INDEX \`IDX_8e1215206acb19f1c38dbda909\` (\`users_id\`), INDEX \`IDX_4a08d003e00caf075a4a212d23\` (\`roles_id\`), PRIMARY KEY (\`users_id\`, \`roles_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`modules\` ADD CONSTRAINT \`FK_52a9f2d98c10ef828ef22635a4c\` FOREIGN KEY (\`id_module\`) REFERENCES \`modules\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_roles\` ADD CONSTRAINT \`FK_8e1215206acb19f1c38dbda9091\` FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_roles\` ADD CONSTRAINT \`FK_4a08d003e00caf075a4a212d23d\` FOREIGN KEY (\`roles_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_roles\` DROP FOREIGN KEY \`FK_4a08d003e00caf075a4a212d23d\``);
        await queryRunner.query(`ALTER TABLE \`user_roles\` DROP FOREIGN KEY \`FK_8e1215206acb19f1c38dbda9091\``);
        await queryRunner.query(`ALTER TABLE \`modules\` DROP FOREIGN KEY \`FK_52a9f2d98c10ef828ef22635a4c\``);
        await queryRunner.query(`DROP INDEX \`IDX_4a08d003e00caf075a4a212d23\` ON \`user_roles\``);
        await queryRunner.query(`DROP INDEX \`IDX_8e1215206acb19f1c38dbda909\` ON \`user_roles\``);
        await queryRunner.query(`DROP TABLE \`user_roles\``);
        await queryRunner.query(`DROP INDEX \`IDX_f9bdd410abefd57f573ec1bf9e\` ON \`parameters\``);
        await queryRunner.query(`DROP TABLE \`parameters\``);
        await queryRunner.query(`DROP TABLE \`casbin_rule\``);
        await queryRunner.query(`DROP INDEX \`IDX_b32d2596a6c578bf737e151747\` ON \`modules\``);
        await queryRunner.query(`DROP TABLE \`modules\``);
        await queryRunner.query(`DROP INDEX \`IDX_fe0bb3f6520ee0469504521e71\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_648e3f5447f725579d7d4ffdfb\` ON \`roles\``);
        await queryRunner.query(`DROP TABLE \`roles\``);
    }

}

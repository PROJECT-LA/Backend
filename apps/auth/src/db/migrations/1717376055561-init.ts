import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1717376055561 implements MigrationInterface {
    name = 'Init1717376055561'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`modules\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`status\` varchar(30) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`title\` varchar(50) NOT NULL COMMENT 'Etiqueta del módulo para el Sidebar del proyecto', \`description\` varchar(250) NULL COMMENT 'Ruta para acceder al módulo', \`icon\` varchar(50) NULL COMMENT 'Icono del módulo', \`order\` int NOT NULL COMMENT 'Orden del modulo en el sidebar', \`url\` varchar(50) NULL COMMENT 'Ruta para acceder al módulo', \`id_role\` bigint NOT NULL COMMENT 'Clave foránea de la reacion con el rol', \`id_module\` bigint NULL COMMENT 'Clave foránea del módulo padre', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`roles\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`status\` varchar(30) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_648e3f5447f725579d7d4ffdfb\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`status\` varchar(30) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`names\` varchar(255) NOT NULL, \`last_names\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`phone\` varchar(255) NULL, \`ci\` varchar(255) NOT NULL, \`image\` varchar(255) NULL, \`address\` text NULL, \`username\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`casbin_rule\` (\`id\` int NOT NULL AUTO_INCREMENT COMMENT 'Clave primaria de la tabla CasbinRule', \`ptype\` varchar(255) NULL COMMENT 'Tipo de política (p,g)', \`v0\` varchar(255) NULL COMMENT 'Regla de acceso (roles)', \`v1\` varchar(255) NULL COMMENT 'Regla de acceso (rutas)', \`v2\` varchar(255) NULL COMMENT 'Regla de acceso (GET, POST, PATCH, DELETE para backend y read, update, create y delete para frontend)', \`v3\` varchar(255) NULL COMMENT 'Regla de acceso (Backend, Frontend)', \`v4\` varchar(255) NULL COMMENT 'Regla de acceso', \`v5\` varchar(255) NULL COMMENT 'Regla de acceso', \`v6\` varchar(255) NULL COMMENT 'Regla de acceso', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`refresh_tokens\` (\`id\` varchar(36) NOT NULL, \`grant_id\` bigint NOT NULL COMMENT 'Id del usuario', \`token\` text NOT NULL COMMENT 'token generado', \`iat\` datetime NOT NULL COMMENT 'Fecha de creación de token', \`exp\` datetime NOT NULL COMMENT 'Fecha expiración de token', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_roles\` (\`users_id\` bigint NOT NULL, \`roles_id\` bigint NOT NULL, INDEX \`IDX_8e1215206acb19f1c38dbda909\` (\`users_id\`), INDEX \`IDX_4a08d003e00caf075a4a212d23\` (\`roles_id\`), PRIMARY KEY (\`users_id\`, \`roles_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`modules\` ADD CONSTRAINT \`FK_1da79dbd3364675f36a910d8be3\` FOREIGN KEY (\`id_role\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`modules\` ADD CONSTRAINT \`FK_52a9f2d98c10ef828ef22635a4c\` FOREIGN KEY (\`id_module\`) REFERENCES \`modules\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_roles\` ADD CONSTRAINT \`FK_8e1215206acb19f1c38dbda9091\` FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_roles\` ADD CONSTRAINT \`FK_4a08d003e00caf075a4a212d23d\` FOREIGN KEY (\`roles_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_roles\` DROP FOREIGN KEY \`FK_4a08d003e00caf075a4a212d23d\``);
        await queryRunner.query(`ALTER TABLE \`user_roles\` DROP FOREIGN KEY \`FK_8e1215206acb19f1c38dbda9091\``);
        await queryRunner.query(`ALTER TABLE \`modules\` DROP FOREIGN KEY \`FK_52a9f2d98c10ef828ef22635a4c\``);
        await queryRunner.query(`ALTER TABLE \`modules\` DROP FOREIGN KEY \`FK_1da79dbd3364675f36a910d8be3\``);
        await queryRunner.query(`DROP INDEX \`IDX_4a08d003e00caf075a4a212d23\` ON \`user_roles\``);
        await queryRunner.query(`DROP INDEX \`IDX_8e1215206acb19f1c38dbda909\` ON \`user_roles\``);
        await queryRunner.query(`DROP TABLE \`user_roles\``);
        await queryRunner.query(`DROP TABLE \`refresh_tokens\``);
        await queryRunner.query(`DROP TABLE \`casbin_rule\``);
        await queryRunner.query(`DROP INDEX \`IDX_fe0bb3f6520ee0469504521e71\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_648e3f5447f725579d7d4ffdfb\` ON \`roles\``);
        await queryRunner.query(`DROP TABLE \`roles\``);
        await queryRunner.query(`DROP TABLE \`modules\``);
    }

}

import { MigrationInterface, QueryRunner } from 'typeorm'

export class Init1713563157763 implements MigrationInterface {
  name = 'Init1713563157763'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`estado\` varchar(30) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`nombres\` varchar(255) NOT NULL, \`apellidos\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`telefono\` varchar(255) NOT NULL, \`username\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`roles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`estado\` varchar(30) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`nombre\` varchar(50) NOT NULL, UNIQUE INDEX \`IDX_a5be7aa67e759e347b1c6464e1\` (\`nombre\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_a5be7aa67e759e347b1c6464e1\` ON \`roles\``
    )
    await queryRunner.query(`DROP TABLE \`roles\``)
    await queryRunner.query(`DROP TABLE \`users\``)
  }
}

import { Role } from 'src/core/roles'
import { MigrationInterface, QueryRunner } from 'typeorm'

export class Roles1714314384267 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const roles = [
      {
        description: 'Administrador',
        name: 'ADMINISTRADOR',
      },
      {
        description: 'Gerente',
        name: 'GERENTE',
      },
      {
        description: 'Auditor',
        name: 'AUDITOR',
      },
      {
        description: 'Cliente',
        name: 'CLIENTE',
      },
    ]
    const newRoles = roles.map((role) => {
      return new Role({ name: role.name, description: role.description })
    })
    await queryRunner.manager.save(newRoles)
  }
  //eslint-disable-next-line
  public async down(queryRunner: QueryRunner): Promise<void> {}
}

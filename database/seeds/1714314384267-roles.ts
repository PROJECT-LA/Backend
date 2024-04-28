import { Role } from 'src/core/roles'
import { MigrationInterface, QueryRunner } from 'typeorm'

export class Roles1714314384267 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const roles = [
      {
        name: 'Administrador',
        rol: 'ADMINISTRADOR',
      },
      {
        name: 'Gerente',
        rol: 'GERENTE',
      },
      {
        name: 'Auditor',
        rol: 'AUDITOR',
      },
      {
        name: 'Cliente',
        rol: 'CLIENTE',
      },
    ]
    const newRoles = roles.map((role) => {
      return new Role({ name: role.name, description: role.rol })
    })
    await queryRunner.manager.save(newRoles)
  }
  //eslint-disable-next-line
  public async down(queryRunner: QueryRunner): Promise<void> {}
}

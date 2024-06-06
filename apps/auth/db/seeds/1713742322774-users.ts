import { MigrationInterface, QueryRunner } from 'typeorm'
import { STATUS, TextService } from '@app/common'
import { User } from '../../src/users/entities'
import { Role } from '../../src/roles/entities'

export class Users1713742322774 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const DEFAULT_PASSWORD = '123'
    const pass = await TextService.encrypt(DEFAULT_PASSWORD)
    const users = [
      {
        names: 'ADMIN',
        lastNames: 'ADMIN',
        email: 'admin@gmail.com',
        password: pass,
        username: 'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date(),
        phone: '71981339',
        status: STATUS.ACTIVE,
        roles: ['1', '2', '3'],
        ci: '123456',
      },
      {
        names: 'GERENTE',
        lastNames: 'GERENTE',
        email: 'gerente@gmail.com',
        password: pass,
        username: 'GERENTE',
        createdAt: new Date(),
        updatedAt: new Date(),
        phone: '63201339',
        status: STATUS.ACTIVE,
        roles: ['2', '3', '4'],
        ci: '4231212',
      },
    ]
    const newUsers = users.map((user) => {
      return new User({
        names: user.names,
        lastNames: user.lastNames,
        email: user.email,
        password: user.password,
        username: user.username,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        phone: user.phone,
        status: user.status,
        ci: user.ci,
        roles: user.roles.map((role) => {
          return new Role({ id: role })
        }),
      })
    })
    await queryRunner.manager.save(newUsers)
  }
  //eslint-disable-next-line
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
import { STATUS } from 'src/common/constants'
import { User } from 'src/core/users/entities/user.entity'
import { MigrationInterface, QueryRunner } from 'typeorm'
import * as bcrypt from 'bcrypt'

export class Users1713742322774 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const users = [
      {
        names: 'ADMIN',
        lastNames: 'ADMIN',
        email: 'admin@gmail.com',
        password: bcrypt.hashSync('123', 10),
        username: 'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date(),
        phone: '71981339',
        status: STATUS.ACTIVE,
      },
      {
        names: 'GERENTE',
        lastNames: 'GERENTE',
        email: 'gerente@gmail.com',
        password: bcrypt.hashSync('123', 10),
        username: 'GERENTE',
        createdAt: new Date(),
        updatedAt: new Date(),
        phone: '63201339',
        status: STATUS.ACTIVE,
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
      })
    })
    await queryRunner.manager.save(newUsers)
  }
  //eslint-disable-next-line
  public async down(queryRunner: QueryRunner): Promise<void> {}
}

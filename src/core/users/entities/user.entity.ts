import { BaseEntity } from 'src/common/abstract/base.entity'
import { STATUS } from 'src/common/constants'
import { IUser } from 'src/core/users/interface/user.interface'
import { BeforeInsert, Column, Entity } from 'typeorm'
@Entity({ name: 'users' })
export class User extends BaseEntity implements IUser {
  @Column()
  names: string

  @Column()
  lastNames: string

  @Column()
  email: string

  @Column()
  password: string

  @Column({ nullable: true })
  phone: string

  @Column()
  username: string

  constructor(data?: Partial<User>) {
    super(data)
  }
  @BeforeInsert()
  insertState() {
    this.status = this.status || STATUS.ACTIVE
  }
}

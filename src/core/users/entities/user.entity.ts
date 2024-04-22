import { BaseEntity } from 'src/common/config/base.entity'
import { IUser } from 'src/common/interfaces/user.interface'
import { Column, Entity } from 'typeorm'
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
}

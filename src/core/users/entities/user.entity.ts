import { STATUS } from 'src/common/constants'
import { Role } from 'src/core/roles'
import { BeforeInsert, Column, Entity, JoinTable, ManyToMany } from 'typeorm'
import { IUser } from '../interface'
import { BaseEntity } from 'src/common'
@Entity({ name: 'users' })
export class User extends BaseEntity implements IUser {
  @Column({ nullable: false })
  names: string

  @Column({ nullable: false })
  lastNames: string

  @Column({ nullable: false, unique: true })
  email: string

  @Column({ nullable: false, update: false })
  password: string

  @Column({ nullable: true })
  phone: string

  @Column({ nullable: false, unique: true })
  username: string

  constructor(data?: Partial<User>) {
    super(data)
  }
  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({ name: 'user_roles' })
  roles: Role[]

  @BeforeInsert()
  insertState() {
    this.status = this.status || STATUS.ACTIVE
  }
}

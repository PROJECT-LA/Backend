import { BaseEntity } from 'src/common/abstract/base.entity'
import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm'
import { IRol } from '../interface'
import { STATUS } from 'src/common/constants'
import { UserRole } from './role-user.entity'

@Entity({ name: 'roles' })
export class Role extends BaseEntity implements IRol {
  @Column()
  rol: string
  @Column()
  name: string
  constructor(data?: Partial<Role>) {
    super(data)
  }
  @OneToMany(() => UserRole, (userRole) => userRole.role)
  userRole: UserRole[]
  @BeforeInsert()
  insertState() {
    this.status = this.status || STATUS.ACTIVE
  }
}

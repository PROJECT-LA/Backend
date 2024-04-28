import { BaseEntity } from 'src/common/abstract/base.entity'
import { BeforeInsert, Column, Entity } from 'typeorm'
import { IRol } from '../interface'
import { STATUS } from 'src/common/constants'

@Entity({ name: 'roles' })
export class Role extends BaseEntity implements IRol {
  @Column()
  rol: string
  @Column()
  name: string
  constructor(data?: Partial<Role>) {
    super(data)
  }
  @BeforeInsert()
  insertState() {
    this.status = this.status || STATUS.ACTIVE
  }
}

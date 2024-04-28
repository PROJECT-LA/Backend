import { BaseEntity } from 'src/common/abstract/base.entity'
import { BeforeInsert, Column, Entity, ManyToMany } from 'typeorm'
import { IRol } from '../interface'
import { STATUS } from 'src/common/constants'

@Entity({ name: 'roles' })
export class Role extends BaseEntity implements IRol {
  @Column({ unique: true, nullable: false })
  name: string
  @Column()
  description: string
  constructor(data?: Partial<Role>) {
    super(data)
  }

  @BeforeInsert()
  insertState() {
    this.status = this.status || STATUS.ACTIVE
  }
}

import {
  BeforeInsert,
  Check,
  Column,
  Entity,
  ManyToMany,
  OneToMany,
} from 'typeorm'
import { BaseEntity, STATUS, UtilService } from '@app/common'
import { User } from '../../users/entities'
import { ModuleEntity } from '../../modules/entities'

@Check(UtilService.buildStatusCheck(STATUS))
@Entity({ name: 'roles' })
export class Role extends BaseEntity {
  @Column({ unique: true, nullable: false })
  name: string
  @Column()
  description: string
  constructor(data?: Partial<Role>) {
    super(data)
  }

  @ManyToMany(() => User, (user) => user.roles)
  users: User[]

  @OneToMany(() => ModuleEntity, (module) => module.role)
  modules: ModuleEntity[]

  @BeforeInsert()
  insertState() {
    this.status = this.status || STATUS.ACTIVE
  }
}

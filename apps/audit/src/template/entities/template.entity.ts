import { BaseEntity, STATUS, UtilService } from '@app/common'
import { Entity, Column, OneToMany, BeforeInsert, Check } from 'typeorm'
import { Control } from '../../control/entities/control.entity'
import { ITemplate } from '../interface'
import { ControlGroup } from '../../group-control/entities'

@Entity('template')
@Check(UtilService.buildStatusCheck(STATUS))
export class Template extends BaseEntity implements ITemplate {
  @Column({ type: 'varchar', length: 100 })
  name: string

  @Column({ type: 'varchar', length: 100 })
  description: string

  @Column({ type: 'varchar', length: 10 })
  version: string

  @OneToMany(() => ControlGroup, (control) => control.)
  controls: Control[]

  constructor(data?: Partial<Control>) {
    super(data)
  }

  @BeforeInsert()
  insertarEstado() {
    this.status = this.status || STATUS.ACTIVE
  }
}

import { BaseEntity, STATUS, UtilService } from '@app/common'
import { Entity, Column, OneToMany, BeforeInsert, Check } from 'typeorm'
import { Control } from '../../control/entities/control.entity'
import { ITemplate } from '../interface'
import { Audit } from 'apps/audit/src/audits/entities/audit.entity'

@Entity('template')
@Check(UtilService.buildStatusCheck(STATUS))
export class Template extends BaseEntity implements ITemplate {
  @Column({ type: 'varchar', length: 100 })
  name: string

  @Column({ type: 'varchar', length: 100 })
  description: string

  @Column({ type: 'varchar', length: 10 })
  version: string

  @OneToMany(() => Control, (control) => control.template)
  controls: Control[]

  constructor(data?: Partial<Control>) {
    super(data)
  }

  @OneToMany(() => Template, (template) => template.audits)
  audits: Audit[]

  @BeforeInsert()
  insertarEstado() {
    this.status = this.status || STATUS.ACTIVE
  }
}

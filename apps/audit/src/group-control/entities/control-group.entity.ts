import { BaseEntity, STATUS, UtilService } from '@app/common'
import {
  Entity,
  Column,
  BeforeInsert,
  Check,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm'
import { IControlGroup } from '../interface'
import { Template } from '../../template/entities'
import { Control } from './control.entity'

@Entity('control_groups')
@Check(UtilService.buildStatusCheck(STATUS))
export class ControlGroup extends BaseEntity implements IControlGroup {
  @Column({ length: 200, type: 'varchar' })
  objectiveControl: string

  @Column({ length: 200, type: 'varchar' })
  objectiveDescription: string

  @Column({ length: 5, type: 'varchar' })
  objectiveCode: string

  @Column({ length: 200, type: 'varchar' })
  groupControl: string

  @Column({ length: 200, type: 'varchar' })
  groupDescription: string

  @Column({ length: 5, type: 'varchar' })
  groupCode: string

  @Column({ name: 'id_template' })
  idTemplate: string

  @ManyToOne(() => Template, (template) => template.controlGroup)
  @JoinColumn({ name: 'id_template', referencedColumnName: 'id' })
  template: Template

  @OneToMany(() => Control, (control) => control.controlGroup)
  controls: Control[]

  constructor(data?: Partial<ControlGroup>) {
    super(data)
  }

  @BeforeInsert()
  insertarEstado() {
    this.status = this.status || STATUS.ACTIVE
  }
}

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
import { Template } from '../../template/entities'
import { Control } from '../../control/entities'
import { Assessment } from '../../assessment/entity'

@Entity('control_groups')
@Check(UtilService.buildStatusCheck(STATUS))
export class ControlGroup extends BaseEntity {
  @Column({ length: 200, type: 'varchar' })
  objective: string

  @Column({ length: 200, type: 'varchar' })
  objectiveDescription: string

  @Column({ length: 7, type: 'varchar' })
  objectiveCode: string

  @Column({ length: 200, type: 'varchar' })
  group: string

  @Column({ length: 200, type: 'varchar' })
  groupDescription: string

  @Column({ length: 7, type: 'varchar' })
  groupCode: string

  @Column({ name: 'id_template' })
  idTemplate: string

  @ManyToOne(() => Template, (template) => template.controlGroup)
  @JoinColumn({ name: 'id_template', referencedColumnName: 'id' })
  template: Template

  @OneToMany(() => Control, (control) => control.controlGroup)
  controls: Control[]

  @OneToMany(() => Assessment, (assessment) => assessment.controlGroup)
  assessment: Assessment[]

  constructor(data?: Partial<ControlGroup>) {
    super(data)
  }

  @BeforeInsert()
  insertarEstado() {
    this.status = this.status || STATUS.ACTIVE
  }
}

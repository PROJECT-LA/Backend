import { BaseEntity, STATUS, UtilService } from '@app/common'
import {
  Entity,
  Column,
  BeforeInsert,
  Check,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { IControl } from '../interface/iControl-entity'
import { ControlGroup } from '../../group-control/entities'

@Entity('controls')
@Check(UtilService.buildStatusCheck(STATUS))
export class Control extends BaseEntity implements IControl {
  @Column({ length: 200, type: 'varchar' })
  name: string

  @Column({ length: 200, type: 'varchar' })
  description: string

  @Column({ length: 10, type: 'varchar' })
  code: string

  @Column({ name: 'id_control_group' })
  idControlGroup: string

  @ManyToOne(() => ControlGroup, (controlGroup) => controlGroup.controls)
  @JoinColumn({ name: 'id_control_group', referencedColumnName: 'id' })
  controlGroup: ControlGroup

  constructor(data?: Partial<Control>) {
    super(data)
  }

  @BeforeInsert()
  insertarEstado() {
    this.status = this.status || STATUS.ACTIVE
  }
}

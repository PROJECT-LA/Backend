import { BaseEntity, STATUS, UtilService } from '@app/common'
import {
  Entity,
  Column,
  BeforeInsert,
  Check,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Template } from '../../template/entities/template.entity'

@Entity('controls')
@Check(UtilService.buildStatusCheck(STATUS))
export class Control extends BaseEntity {
  @Column({ length: 200, type: 'varchar' })
  oControl: string

  @Column({ length: 200, type: 'varchar' })
  oControlDescription: string

  @Column({ length: 5, type: 'varchar' })
  oControlCode: string

  @Column({ length: 200, type: 'varchar' })
  gControl: string

  @Column({ length: 200, type: 'varchar' })
  gControlDescripcion: string

  @Column({ length: 5, type: 'varchar' })
  gControlCode: string

  @Column({ length: 200, type: 'varchar' })
  eControl: string

  @Column({ length: 200, type: 'varchar' })
  eControlDescription: string

  @Column({ length: 5, type: 'varchar' })
  eControlCode: string

  @Column({
    type: 'bigint',
    nullable: false,
    comment: 'Clave foránea de la reacion con el rol',
  })
  idRole: string

  @ManyToOne(() => Template, (template) => template.controls)
  @JoinColumn({ name: 'id_template', referencedColumnName: 'id' })
  template: Template

  constructor(data?: Partial<Control>) {
    super(data)
  }

  @BeforeInsert()
  insertarEstado() {
    this.status = this.status || STATUS.ACTIVE
  }
}

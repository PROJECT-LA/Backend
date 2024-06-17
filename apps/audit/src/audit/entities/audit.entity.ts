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
import { IAudit } from '../interface/iAudit-entity'
import { Template } from '../../template/entities'
import { Personal } from '../../personal/entities'

@Entity('audits')
@Check(UtilService.buildStatusCheck(STATUS))
export class Audit extends BaseEntity implements IAudit {
  @Column({ length: 200, type: 'varchar' })
  objective: string

  @Column({ length: 200, type: 'varchar' })
  description: string

  @Column({ nullable: true })
  beginDate: Date

  @Column({ nullable: true })
  finalDate: Date

  @Column({ nullable: false })
  idTemplate: string

  @ManyToOne(() => Template, (template) => template.audits)
  @JoinColumn({ name: 'id_template', referencedColumnName: 'id' })
  template: Template

  @Column({ nullable: false })
  idClient: string

  @OneToMany(() => Personal, (personal) => personal.audit)
  personal: Personal[]

  constructor(data?: Partial<Audit>) {
    super(data)
  }

  @BeforeInsert()
  insertarEstado() {
    this.status = this.status || STATUS.ACTIVE
  }
}

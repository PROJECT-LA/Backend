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
import { Level } from '../../level/entities'

@Entity('audits')
@Check(UtilService.buildStatusCheck(STATUS))
export class Audit extends BaseEntity implements IAudit {
  @Column({ length: 200, type: 'varchar' })
  objective: string

  @Column({ length: 200, type: 'varchar' })
  description: string

  @Column({ type: 'datetime', nullable: true })
  beginDate: Date

  @Column({ type: 'datetime', nullable: true })
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

  @Column({ nullable: false })
  idLevel: string

  @ManyToOne(() => Level, (level) => level.audits)
  @JoinColumn({ name: 'id_level', referencedColumnName: 'id' })
  level: Level

  @Column({ nullable: false })
  acceptanceLevel: number

  constructor(data?: Partial<Audit>) {
    super(data)
  }

  @BeforeInsert()
  insertarEstado() {
    this.status = this.status || STATUS.ACTIVE
  }
}

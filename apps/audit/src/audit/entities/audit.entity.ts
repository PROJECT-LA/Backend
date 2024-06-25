import { AUDIT_STATUS, BaseEntity, UtilService } from '@app/common'
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
import { UserAudit } from '../../user-audits/entities'
import { Level } from '../../level/entities'
import { Assessment } from '../../assessment/entity'

@Entity('audits')
@Check(UtilService.buildStatusCheck(AUDIT_STATUS))
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

  @OneToMany(() => UserAudit, (personal) => personal.audit)
  personal: UserAudit[]

  @OneToMany(() => Assessment, (assessment) => assessment.audit)
  assessment: Assessment[]

  @Column({ nullable: false })
  idLevel: string

  @ManyToOne(() => Level, (level) => level.audits)
  @JoinColumn({ name: 'id_level', referencedColumnName: 'id' })
  level: Level

  constructor(data?: Partial<Audit>) {
    super(data)
  }

  @BeforeInsert()
  insertarEstado() {
    this.status = this.status || AUDIT_STATUS.CREATE
  }
}

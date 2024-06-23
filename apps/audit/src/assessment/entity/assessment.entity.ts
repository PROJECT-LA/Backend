import { Entity, Column, ManyToOne, JoinColumn, BeforeInsert } from 'typeorm'
import { Audit } from '../../audit/entities'
import { ControlGroup } from '../../group-control/entities'
import { BaseEntity, STATUS } from '@app/common'

@Entity({ name: 'assessment' })
export class Assessment extends BaseEntity {
  @Column({ nullable: false })
  idAudit: string

  @ManyToOne(() => Audit, (audit) => audit.assessment)
  @JoinColumn({ name: 'id_audit', referencedColumnName: 'id' })
  audit: Audit

  @ManyToOne(() => ControlGroup)
  controlGroup: ControlGroup

  @Column()
  idGroupControl: number

  @Column({ type: 'int', nullable: false })
  version: number

  @Column({ type: 'text', nullable: true })
  accordance: string

  @Column({ type: 'text', nullable: true })
  disagreement: string

  @Column({ type: 'int', nullable: false })
  acceptanceLevel: number

  constructor(data?: Partial<Assessment>) {
    super(data)
  }

  @BeforeInsert()
  insertState() {
    this.status = this.status || STATUS.ACTIVE
  }
}

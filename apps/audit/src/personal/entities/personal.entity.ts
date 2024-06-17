import { BaseEntity, STATUS, UtilService } from '@app/common'
import {
  Entity,
  Column,
  BeforeInsert,
  Check,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Audit } from '../../audit/entities'

@Entity('personal')
@Check(UtilService.buildStatusCheck(STATUS))
export class Personal extends BaseEntity {
  @Column({ name: 'id_audit' })
  idAudit: string

  @ManyToOne(() => Audit, (audit) => audit.personal)
  @JoinColumn({ name: 'id_audit', referencedColumnName: 'id' })
  audit: Audit

  @Column({ type: 'bigint', nullable: false })
  idUser: string

  constructor(data?: Partial<Personal>) {
    super(data)
  }

  @BeforeInsert()
  insertarEstado() {
    this.status = this.status || STATUS.ACTIVE
  }
}

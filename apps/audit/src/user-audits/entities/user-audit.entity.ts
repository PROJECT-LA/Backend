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
import { IPersonal } from '../interface'

@Entity('user-audit')
@Check(UtilService.buildStatusCheck(STATUS))
export class UserAudit extends BaseEntity implements IPersonal {
  @Column({ name: 'id_audit' })
  idAudit: string

  @ManyToOne(() => Audit, (audit) => audit.personal)
  @JoinColumn({ name: 'id_audit', referencedColumnName: 'id' })
  audit: Audit

  @Column({ type: 'bigint', nullable: false })
  idUser: string

  constructor(data?: Partial<UserAudit>) {
    super(data)
  }

  @BeforeInsert()
  insertarEstado() {
    this.status = this.status || STATUS.ACTIVE
  }
}

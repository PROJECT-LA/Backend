import { BaseEntity, STATUS } from '@app/common'
import { Template } from 'apps/audit/src/template/entities'
import { Entity, Column, BeforeInsert, ManyToOne, JoinColumn } from 'typeorm'

@Entity('audits')
export class Audit extends BaseEntity {
  @Column({ type: 'bigint' })
  idClient: string

  @Column({ type: 'varchar', length: 200 })
  object: string

  @Column({ type: 'varchar', length: 200 })
  description: string

  @Column({ type: 'date' })
  dateBegin: Date

  @Column({ type: 'date', nullable: true })
  dateEnd: Date

  constructor(data?: Partial<Audit>) {
    super(data)
  }

  @ManyToOne(() => Template, (template) => template.audits, {})
  @JoinColumn({ name: 'id_template', referencedColumnName: 'id' })
  template: Template

  @BeforeInsert()
  insertarEstado() {
    this.status = this.status || STATUS.ACTIVE
  }
}

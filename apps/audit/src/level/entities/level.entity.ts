import { BaseEntity, STATUS } from '@app/common'
import { Entity, Column, BeforeInsert } from 'typeorm'

@Entity('maturity_levels')
export class MaturityLevel extends BaseEntity {
  @Column({ type: 'int' })
  level: number

  @Column({ type: 'varchar', length: 200 })
  description: string

  constructor(data?: Partial<MaturityLevel>) {
    super(data)
  }

  @BeforeInsert()
  insertStatus() {
    this.status = this.status || STATUS.ACTIVE
  }
}

import { BaseEntity, STATUS } from '@app/common'
import { Entity, Column, BeforeInsert, OneToMany } from 'typeorm'
import { ILevel } from '../interfaces/iLevel-entity'
import { Audit } from '../../audit/entities'

@Entity('maturity_levels')
export class Level extends BaseEntity implements ILevel {
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    unique: true,
    comment: 'Level name',
  })
  name: string

  @Column({ type: 'int', nullable: false, comment: 'Level grade' })
  grade: number

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
    comment: 'Level description',
  })
  description: string

  @OneToMany(() => Audit, (audit) => audit.level)
  audits: Audit[]

  constructor(data?: Partial<Level>) {
    super(data)
  }

  @BeforeInsert()
  insertStatus() {
    this.status = this.status || STATUS.ACTIVE
  }
}

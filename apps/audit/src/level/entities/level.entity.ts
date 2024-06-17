import { BaseEntity, STATUS } from '@app/common'
import { Entity, Column, BeforeInsert } from 'typeorm'
import { ILevel } from '../interfaces/iLevel-entity'

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

  constructor(data?: Partial<Level>) {
    super(data)
  }

  @BeforeInsert()
  insertStatus() {
    this.status = this.status || STATUS.ACTIVE
  }
}

import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { BaseEntity as TypeOrmBaseEntity } from 'typeorm'
import { STATUS } from '../constants'
export abstract class BaseEntity extends TypeOrmBaseEntity {
  @PrimaryGeneratedColumn()
  id: number
  @Column({
    name: 'state',
    length: 30,
    type: 'varchar',
    nullable: false,
  })
  state: string

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date

  @BeforeInsert()
  insertarEstado() {
    this.state = this.state || STATUS.ACTIVE
  }
  protected constructor(data?: Partial<BaseEntity>) {
    super()
    if (data) Object.assign(this, data)
  }
}

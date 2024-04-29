import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { BaseEntity as TypeOrmBaseEntity } from 'typeorm'
export abstract class BaseEntity extends TypeOrmBaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string

  @Column({
    name: 'state',
    length: 30,
    type: 'varchar',
    nullable: false,
  })
  status: string

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date

  protected constructor(data?: Partial<BaseEntity>) {
    super()
    if (data) Object.assign(this, data)
  }
}

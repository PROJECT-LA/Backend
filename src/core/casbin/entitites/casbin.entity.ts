/* import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import dotenv from 'dotenv'

dotenv.config()

@Entity({ schema: process.env.DB_SCHEMA_USUARIOS })
export class CasbinRule extends BaseEntity {
  @Column({
    nullable: true,
    type: 'varchar',
    comment: 'Tipo de política (p,g)',
  })
  public ptype: string | null

  @Column({
    nullable: true,
    type: 'varchar',
    comment: 'Regla de acceso (roles)',
  })
  public v0: string | null

  @Column({
    nullable: true,
    type: 'varchar',
    comment: 'Regla de acceso (rutas)',
  })
  public v1: string | null

  @Column({
    nullable: true,
    type: 'varchar',
    comment:
      'Regla de acceso (GET, POST, PATCH, DELETE para backend y read, update, create y delete para frontend)',
  })
  public v2: string | null

  @Column({
    nullable: true,
    type: 'varchar',
    comment: 'Regla de acceso (Backend, Frontend)',
  })
  public v3: string | null

  constructor(data?: Partial<CasbinRule>) {
    super()
    if (data) Object.assign(this, data)
  }
}
 */

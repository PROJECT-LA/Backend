import { BaseEntity } from 'src/common/abstract/base.entity'
import { Column, Entity } from 'typeorm'

@Entity()
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
  @Column({
    nullable: true,
    type: 'varchar',
    comment: 'Regla de acceso',
  })
  public v4: string | null

  @Column({
    nullable: true,
    type: 'varchar',
    comment: 'Regla de acceso',
  })
  public v5: string | null

  @Column({
    nullable: true,
    type: 'varchar',
    comment: 'Regla de acceso',
  })
  public v6: string | null

  constructor(data?: Partial<CasbinRule>) {
    super()
    if (data) Object.assign(this, data)
  }
}

import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

/**
 * @Entity Decorador que marca la clase como una entidad de base de datos.
 * @description La clase 'CasbinRule' representa una regla dentro del sistema de control de acceso Casbin, extendiendo 'BaseEntity'.
 *
 * @property {string} id - Clave primaria de la tabla CasbinRule.
 * @property {string | null} ptype - Tipo de política, puede ser 'p' para políticas o 'g' para grupos.
 * @property {string | null} v0 - Regla de acceso relacionada con roles.
 * @property {string | null} v1 - Regla de acceso relacionada con rutas.
 * @property {string | null} v2 - Regla de acceso relacionada con métodos HTTP para backend (GET, POST, PATCH, DELETE) y acciones (read, update, create, delete) para frontend.
 * @property {string | null} v3 - Regla de acceso que especifica si es para Backend o Frontend.
 * @property {string | null} v4 - Regla de acceso, que especifica el estado de la regla.
 * @property {string | null} v5 - Regla de acceso adicional, su uso depende de la implementación específica.
 * @property {string | null} v6 - Regla de acceso adicional, su uso depende de la implementación específica.
 *
 * @constructor
 * @param {Partial<CasbinRule>} data - Objeto opcional para inicializar propiedades de la entidad con valores predeterminados.
 */
@Entity()
export class CasbinRule extends BaseEntity {
  @PrimaryGeneratedColumn({
    comment: 'Clave primaria de la tabla CasbinRule',
  })
  public id: string

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

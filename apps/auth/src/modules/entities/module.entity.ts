import { BaseEntity, STATUS, UtilService } from '@app/common'
import {
  BeforeInsert,
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm'
import { Role } from '../../roles/entities'

/**
 * @Check Aplica una condición de verificación en la base de datos para asegurar que el estado del módulo sea válido.
 * @Entity Marca la clase como una entidad de base de datos con el nombre 'modules'.
 * @description La clase 'ModuleEntity' representa un módulo dentro del sistema, extendiendo 'BaseEntity' para incluir campos comunes.
 *
 * @property {string} title - Título del módulo, mostrado en el Sidebar del proyecto.
 * @property {string} description - Descripción o ruta para acceder al módulo. Es opcional.
 * @property {string | null} icon - Icono representativo del módulo. Es opcional.
 * @property {number} order - Define el orden de aparición del módulo en el Sidebar.
 * @property {string | null} url - Ruta para acceder al módulo. Es opcional.
 * @property {string} idRole - Clave foránea que relaciona el módulo con un rol específico.
 * @property {Role} role - Relación muchos a uno con la entidad 'Role'. Un módulo pertenece a un rol.
 * @property {string | null} idModule - Clave foránea del módulo padre, para módulos que son submódulos de otro. Es opcional.
 * @property {ModuleEntity[]} subModule - Submódulos de este módulo. Define una relación de uno a muchos con la entidad 'ModuleEntity'.
 * @property {ModuleEntity} module - Módulo padre de este submódulo. Define una relación de muchos a uno con la entidad 'ModuleEntity'.
 *
 * @constructor
 * @param {Partial<ModuleEntity>} data - Objeto opcional para inicializar propiedades de la entidad con valores predeterminados.
 *
 * @BeforeInsert Decorador que define un método a ejecutarse antes de insertar la entidad en la base de datos.
 * Este método establece el estado del módulo como ACTIVO si no se ha proporcionado uno.
 */

@Check(UtilService.buildStatusCheck(STATUS))
@Entity({ name: 'modules' })
export class ModuleEntity extends BaseEntity {
  @Column({
    length: 50,
    type: 'varchar',
    comment: 'Etiqueta del módulo para el Sidebar del proyecto',
  })
  title: string

  @Column({
    length: 250,
    type: 'varchar',
    comment: 'Ruta para acceder al módulo',
    nullable: true,
  })
  description: string

  @Column({
    length: 50,
    type: 'varchar',
    comment: 'Icono del módulo',
    nullable: true,
  })
  icon: string | null

  @Column({
    type: 'int',
    comment: 'Orden del modulo en el sidebar',
  })
  order: number

  @Column({
    length: 50,
    type: 'varchar',
    comment: 'Ruta para acceder al módulo',
    nullable: true,
  })
  url: string | null

  @Column({
    type: 'bigint',
    nullable: false,
    comment: 'Clave foránea de la reacion con el rol',
  })
  idRole: string

  @ManyToOne(() => Role, (role) => role.modules)
  @JoinColumn({ name: 'id_role', referencedColumnName: 'id' })
  role: Role

  @Column({
    type: 'bigint',
    nullable: true,
    comment: 'Clave foránea del módulo padre',
  })
  idModule: string | null

  @OneToMany(() => ModuleEntity, (module) => module.module, { cascade: true })
  subModule: ModuleEntity[]

  @ManyToOne(() => ModuleEntity, (module) => module.subModule, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_module', referencedColumnName: 'id' })
  module: ModuleEntity

  constructor(data?: Partial<ModuleEntity>) {
    super(data)
  }

  @BeforeInsert()
  insertarEstado() {
    this.status = this.status || STATUS.ACTIVE
  }
}

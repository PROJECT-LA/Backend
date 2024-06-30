import {
  BeforeInsert,
  Check,
  Column,
  Entity,
  ManyToMany,
  OneToMany,
} from 'typeorm'
import { BaseEntity, STATUS, UtilService } from '@app/common'
import { User } from '../../users/entities'
import { ModuleEntity } from '../../modules/entities'

/**
 * @Entity Decorador que marca la clase como una entidad de base de datos con el nombre 'roles'.
 * @Check Aplica una condición de verificación en la base de datos para asegurar que el estado del rol sea válido, utilizando UtilService.buildStatusCheck.
 * @description La clase 'Role' representa un rol dentro del sistema, extendiendo 'BaseEntity' para incluir campos comunes como id, fecha de creación y actualización.
 *
 * @property {string} name - Nombre del rol. Es único y no puede ser nulo.
 * @property {string} description - Descripción del rol.
 * @property {User[]} users - Usuarios asociados al rol. Define una relación de muchos a muchos con la entidad 'User'.
 * @property {ModuleEntity[]} modules - Módulos asociados al rol. Define una relación de uno a muchos con la entidad 'ModuleEntity'.
 *
 * @constructor
 * @param {Partial<Role>} data - Objeto opcional para inicializar propiedades de la entidad con valores predeterminados.
 *
 * @BeforeInsert Decorador que define un método a ejecutarse antes de insertar la entidad en la base de datos.
 * Este método establece el estado del rol como ACTIVO si no se ha proporcionado uno.
 */
@Check(UtilService.buildStatusCheck(STATUS))
@Entity({ name: 'roles' })
export class Role extends BaseEntity {
  @Column({ unique: true, nullable: false })
  name: string
  @Column()
  description: string

  constructor(data?: Partial<Role>) {
    super(data)
  }

  @ManyToMany(() => User, (user) => user.roles)
  users: User[]

  @OneToMany(() => ModuleEntity, (module) => module.role)
  modules: ModuleEntity[]

  @BeforeInsert()
  insertState() {
    this.status = this.status || STATUS.ACTIVE
  }
}

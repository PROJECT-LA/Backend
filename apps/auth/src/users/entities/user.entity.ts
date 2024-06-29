import { BeforeInsert, Column, Entity, JoinTable, ManyToMany } from 'typeorm'
import { BaseEntity, STATUS } from '@app/common'
import { Role } from '../../roles/entities'

/**
 * Entidad de Usuario.
 *
 * Representa un usuario en el sistema, extendiendo las propiedades básicas de BaseEntity.
 * Incluye información personal y de contacto, así como las credenciales de acceso y roles asociados.
 *
 * @Entity Decorador que marca la clase como una entidad de base de datos con el nombre 'users'.
 *
 * Campos:
 * - names: Nombres del usuario.
 * - lastNames: Apellidos del usuario.
 * - email: Correo electrónico del usuario, debe ser único.
 * - password: Contraseña del usuario.
 * - phone: Teléfono del usuario, es opcional.
 * - ci: Carnet de identidad del usuario.
 * - image: Imagen de perfil del usuario, es opcional.
 * - address: Dirección del usuario, es opcional.
 * - username: Nombre de usuario, debe ser único.
 * - roles: Roles asociados al usuario, relación muchos a muchos.
 *
 * @BeforeInsert Decorador que define un método a ejecutarse antes de insertar la entidad en la base de datos.
 * Este método establece el estado del usuario como ACTIVO si no se ha proporcionado uno.
 *
 * @param {Partial<User>} data - Objeto parcial de User para inicializar la entidad con valores predeterminados.
 */
@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column({ nullable: false })
  names: string

  @Column({ nullable: false })
  lastNames: string

  @Column({ nullable: false, unique: true })
  email: string

  @Column({ nullable: false })
  password: string

  @Column({ nullable: true })
  phone: string

  @Column({ nullable: false })
  ci: string

  @Column({ nullable: true })
  image?: string

  @Column({ type: 'text', nullable: true })
  address: string

  @Column({ nullable: false, unique: true })
  username: string

  constructor(data?: Partial<User>) {
    super(data)
  }

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({ name: 'user_roles' })
  roles: Role[]

  @BeforeInsert()
  insertState() {
    this.status = this.status || STATUS.ACTIVE
  }
}

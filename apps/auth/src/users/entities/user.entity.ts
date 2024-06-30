import { BeforeInsert, Column, Entity, JoinTable, ManyToMany } from 'typeorm'
import { BaseEntity, STATUS } from '@app/common'
import { Role } from '../../roles/entities'

/**
 * @Entity Decorador que marca la clase como una entidad de base de datos con el nombre 'users'.
 * @description Representa un usuario en el sistema, extendiendo las propiedades básicas de BaseEntity.
 * Incluye información personal y de contacto, así como las credenciales de acceso y roles asociados.
 *
 * @property {string} names - Nombres del usuario. No puede ser nulo.
 * @property {string} lastNames - Apellidos del usuario. No puede ser nulo.
 * @property {string} email - Correo electrónico del usuario, debe ser único. No puede ser nulo.
 * @property {string} password - Contraseña del usuario. No puede ser nulo.
 * @property {string} phone - Teléfono del usuario, es opcional.
 * @property {string} ci - Carnet de identidad del usuario. No puede ser nulo.
 * @property {string} image - Imagen de perfil del usuario, es opcional.
 * @property {string} address - Dirección del usuario, es opcional. Almacenado como texto.
 * @property {string} username - Nombre de usuario, debe ser único. No puede ser nulo.
 * @property {Role[]} roles - Roles asociados al usuario, relación muchos a muchos.
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

  @Column({ nullable: false, unique: true })
  ci: string

  @Column({ nullable: true })
  image: string

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

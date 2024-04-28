import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm'
import { Role } from './role.entity'
import { User } from 'src/core/users'
@Entity({ name: 'user_roles' })
@Unique(['idUser', 'idRole'])
export class UserRole {
  @Column({
    type: 'bigint',
    nullable: false,
    comment: 'Clave foránea que referencia la tabla de roles',
  })
  idRole: string

  @Column({
    type: 'bigint',
    nullable: false,
    comment: 'Clave foránea que referencia la tabla usuarios',
  })
  idUser: string

  @ManyToOne(() => Role, (role) => role.userRole)
  @JoinColumn({ name: 'id_role', referencedColumnName: 'id' })
  role: Role

  @ManyToOne(() => User, (user) => user.userRole)
  @JoinColumn({ name: 'id_user', referencedColumnName: 'id' })
  user: User
}

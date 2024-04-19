import { BaseEntity } from 'src/common/config/base.entity'
import { IUser } from 'src/common/interfaces/user.interface'
import { Column, Entity } from 'typeorm'

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity implements IUser {
  @Column()
  nombres: string
  @Column()
  apellidos: string
  @Column()
  email: string
  @Column()
  password: string
  @Column()
  telefono: string
  @Column()
  username: string
}

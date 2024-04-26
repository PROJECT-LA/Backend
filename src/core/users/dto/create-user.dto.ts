import { IUser } from 'src/core/users/interface/user.interface'
import { IsNotEmpty, MaxLength } from 'src/common/validation'

export class CreateUserDto implements IUser {
  @IsNotEmpty()
  @MaxLength(30)
  names: string

  @IsNotEmpty()
  @MaxLength(50)
  lastNames: string

  @MaxLength(50)
  email: string

  @MaxLength(30)
  password: string

  phone?: string

  @MaxLength(30)
  username: string

  status?: string
}

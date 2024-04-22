import { IUser } from 'src/common/interfaces/user.interface'
import { IsOptional, MaxLength } from 'src/common/validation'

export class UpdateUserDto implements Partial<IUser> {
  @IsOptional()
  @MaxLength(30)
  names?: string

  @IsOptional()
  @MaxLength(50)
  lastNames?: string

  @IsOptional()
  @MaxLength(50)
  email?: string

  @IsOptional()
  @MaxLength(30)
  password?: string

  @IsOptional()
  phone?: string

  @IsOptional()
  @MaxLength(30)
  username?: string

  @IsOptional()
  status?: string
}

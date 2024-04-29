import { IUser } from 'src/core/users/interface/user.interface'
import { IsNotEmpty, MaxLength } from 'src/common/validation'
import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto implements IUser {
  @ApiProperty({ example: 'Juan' })
  @IsNotEmpty()
  @MaxLength(30)
  names: string

  @ApiProperty({ example: 'Perez' })
  @IsNotEmpty()
  @MaxLength(50)
  lastNames: string

  @ApiProperty({ example: 'example@mail.com' })
  @MaxLength(50)
  email: string

  @ApiProperty({ example: '123' })
  @MaxLength(30)
  password: string

  phone?: string

  @ApiProperty({ example: 'JPEREZ' })
  @MaxLength(30)
  username: string

  @IsNotEmpty()
  @ApiProperty({ example: ['1'] })
  roles: Array<string>

  status?: string
}

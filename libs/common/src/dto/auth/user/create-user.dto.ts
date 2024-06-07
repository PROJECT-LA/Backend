import { IsNotEmpty, MaxLength } from '../../../validation'
import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
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

  @ApiProperty({ example: '123456' })
  @MaxLength(10)
  ci: string

  address?: string

  status?: string
}

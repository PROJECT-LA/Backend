import { IsOptional, MaxLength } from 'src/common/validation'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { IUser } from '../interface'

export class UpdateUserDto implements Partial<IUser> {
  @ApiProperty({ example: 'Juan' })
  @IsOptional()
  @MaxLength(30)
  names?: string
  @ApiProperty({ example: 'Perez' })
  @IsOptional()
  @MaxLength(50)
  lastNames?: string

  @ApiProperty({ example: 'example@mail.com' })
  @IsOptional()
  @MaxLength(50)
  email?: string

  @IsOptional()
  phone?: string

  @ApiProperty({ example: 'JPEREZ' })
  @IsOptional()
  @MaxLength(30)
  username?: string

  @IsNotEmpty()
  @ApiProperty({ example: ['1'] })
  roles: Array<string>
}

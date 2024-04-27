import { IUser } from 'src/core/users/interface/user.interface'
import { IsOptional, MaxLength } from 'src/common/validation'
import { ApiProperty } from '@nestjs/swagger'

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

  @IsOptional()
  status?: string
}

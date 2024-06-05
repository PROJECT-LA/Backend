import { IsNotEmpty, MaxLength } from '@app/common'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateProfileDto {
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

  phone?: string

  @ApiProperty({ example: '123456' })
  @MaxLength(10)
  ci: string

  address?: string
}

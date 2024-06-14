import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, MaxLength } from '../../../validation'

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

  address?: string
}

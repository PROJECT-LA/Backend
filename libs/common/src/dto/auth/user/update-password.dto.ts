import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from '../../../validation'

export class ChangePaswwordDto {
  @ApiProperty({
    example: '123',
    description: 'Contraseña',
  })
  @IsNotEmpty()
  password: string

  @ApiProperty({
    example: '123',
    description: 'Contraseña',
  })
  @IsNotEmpty()
  newPassword: string
}

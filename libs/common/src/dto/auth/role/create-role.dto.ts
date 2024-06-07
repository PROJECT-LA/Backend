import { IsNotEmpty, MaxLength } from '../../../validation'
import { ApiProperty } from '@nestjs/swagger'

export class CreateRoleDto {
  @ApiProperty({ example: 'TECNICO' })
  @IsNotEmpty()
  @MaxLength(30)
  name: string

  @ApiProperty({ example: 'Tecnico: Rol Administrativo' })
  @IsNotEmpty()
  @MaxLength(250)
  description: string
}

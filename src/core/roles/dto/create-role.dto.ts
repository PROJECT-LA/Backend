import { IsNotEmpty, MaxLength } from 'class-validator'
import { IRol } from '../interface'
import { ApiProperty } from '@nestjs/swagger'

export class CreateRoleDto implements IRol {
  @ApiProperty({ example: 'TECNICO' })
  @IsNotEmpty()
  @MaxLength(30)
  name: string

  @ApiProperty({ example: 'Tecnico' })
  @IsNotEmpty()
  @MaxLength(30)
  rol: string
}

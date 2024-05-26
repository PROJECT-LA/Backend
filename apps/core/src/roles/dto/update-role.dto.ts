import { IsNotEmpty, MaxLength } from '@app/common'
import { IRol } from '../interface'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateRoleDto implements IRol {
  @ApiProperty({ example: 'TECNICO' })
  @IsNotEmpty()
  @MaxLength(30)
  name: string

  @ApiProperty({ example: 'Tecnico: Rol Administrativo' })
  @IsNotEmpty()
  @MaxLength(250)
  description: string
}

import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from '../../../validation'

export class ChangeRoleDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '1' })
  idRole: string
}

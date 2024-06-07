import { IsNotEmpty, MaxLength } from '../../../validation'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateControlDto {
  @ApiProperty({ example: 'ECONTROL' })
  @IsNotEmpty()
  @MaxLength(200)
  eControl: string

  @ApiProperty({ example: 'ECONTROL-DESCRIPTION' })
  @IsNotEmpty()
  @MaxLength(200)
  eDescription: string

  @ApiProperty({ example: 'E-123' })
  @IsNotEmpty()
  @MaxLength(5)
  eCode: string
}

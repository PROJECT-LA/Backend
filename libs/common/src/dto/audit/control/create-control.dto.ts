import { IsNotEmpty, MaxLength } from '../../../validation'
import { ApiProperty } from '@nestjs/swagger'

export class CreateControlDto {
  @ApiProperty({ example: 'ECONTROL' })
  @IsNotEmpty()
  @MaxLength(200)
  eControl: string

  @ApiProperty({ example: 'ECONTROL-DESCRIPTION' })
  @IsNotEmpty()
  @MaxLength(200)
  eControlDescription: string

  @ApiProperty({ example: 'E-123' })
  @IsNotEmpty()
  @MaxLength(5)
  eControlCode: string

  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  idControlGroup: string
}

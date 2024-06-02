import { IsNotEmpty, MaxLength } from '../../../validation'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateControlDto {
  @ApiProperty({ example: 'OCONTROL' })
  @IsNotEmpty()
  @MaxLength(200)
  oControl: string

  @ApiProperty({ example: 'OCONTROL-DESCRIPTION' })
  @IsNotEmpty()
  @MaxLength(200)
  oControlDescription: string

  @ApiProperty({ example: 'OCONTROL_CODE' })
  @IsNotEmpty()
  @MaxLength(5)
  oControlCode: string

  @ApiProperty({ example: 'GCONTROL' })
  @IsNotEmpty()
  @MaxLength(200)
  gControl: string

  @ApiProperty({ example: 'GCONTROL-DESCRIPTION' })
  @IsNotEmpty()
  @MaxLength(200)
  gControlDescription: string

  @ApiProperty({ example: 'GCONTROL_CODE' })
  @IsNotEmpty()
  @MaxLength(5)
  gControlCode: string

  @ApiProperty({ example: 'ECONTROL' })
  @IsNotEmpty()
  @MaxLength(200)
  eControl: string

  @ApiProperty({ example: 'ECONTROL-DESCRIPTION' })
  @IsNotEmpty()
  @MaxLength(200)
  eControlDescription: string

  @ApiProperty({ example: 'ECONTROL_CODE' })
  @IsNotEmpty()
  @MaxLength(5)
  eControlCode: string
}

import { IsNotEmpty, MaxLength } from '../../../validation'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateControlGroupDto {
  @ApiProperty({ example: 'OCONTROL' })
  @IsNotEmpty()
  @MaxLength(200)
  objectiveControl: string

  @ApiProperty({ example: 'OCONTROL-DESCRIPTION' })
  @IsNotEmpty()
  @MaxLength(200)
  objectiveDescription: string

  @ApiProperty({ example: 'O-123' })
  @IsNotEmpty()
  @MaxLength(5)
  objectiveCode: string

  @ApiProperty({ example: 'GCONTROL' })
  @IsNotEmpty()
  @MaxLength(200)
  groupControl: string

  @ApiProperty({ example: 'GCONTROL-DESCRIPTION' })
  @IsNotEmpty()
  @MaxLength(200)
  groupDescription: string

  @ApiProperty({ example: 'G-123' })
  @IsNotEmpty()
  @MaxLength(5)
  groupCode: string
}

import { IsNotEmpty, MaxLength } from '../../../validation'
import { ApiProperty } from '@nestjs/swagger'

export class CreateTemplateDto {
  @ApiProperty({ example: 'ISO 27001' })
  @IsNotEmpty()
  @MaxLength(100)
  name: string

  @ApiProperty({ example: 'Normativa Vigente' })
  @IsNotEmpty()
  @MaxLength(100)
  description: string

  @ApiProperty({ example: '2024' })
  @IsNotEmpty()
  @MaxLength(10)
  version: string
}

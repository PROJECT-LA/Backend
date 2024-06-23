import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsOptional } from '../../../validation'

export class CreateAssessmentDto {
  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  idAudit: string

  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  idGroupControl: number

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  version: number

  @ApiProperty({ example: '1' })
  @IsOptional()
  accordance: string

  @IsOptional()
  disagreement: string

  @ApiProperty({ example: 1 })
  @IsOptional()
  acceptanceLevel: number
}

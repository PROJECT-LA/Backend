import { ApiProperty } from '@nestjs/swagger'
import { IsOptional } from '../../../validation'

export class UpdateAssessmentDTo {
  @ApiProperty({ example: '1' })
  @IsOptional()
  accordance: string

  @IsOptional()
  disagreement: string

  @ApiProperty({ example: 1 })
  @IsOptional()
  acceptanceLevel: number
}

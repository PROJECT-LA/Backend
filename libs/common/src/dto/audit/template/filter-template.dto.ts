import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from '../../../validation'
import { PaginationQueryDto } from '../../base'

export class FilterTemplateDto extends PaginationQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly status?: string
}

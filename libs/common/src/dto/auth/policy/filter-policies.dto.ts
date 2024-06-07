import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional } from '../../../validation'
import { PaginationQueryDto } from '../../base'

export class FilterPoliciesDto extends PaginationQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly aplication?: string
}

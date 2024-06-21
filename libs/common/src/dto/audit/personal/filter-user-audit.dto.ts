import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from '../../../validation'
import { PaginationQueryDto } from '../../base'

export class FilterUserAuditDto extends PaginationQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly status?: string

  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  @IsString()
  readonly idAudit?: string
}

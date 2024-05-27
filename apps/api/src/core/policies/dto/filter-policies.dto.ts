import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString, PaginationQueryDto } from '@app/common'

export class FilterPoliciesDto extends PaginationQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly aplication?: string
}

import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString, PaginationQueryDto } from '@app/common'
export class FilterRoleDto extends PaginationQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly status?: string
}

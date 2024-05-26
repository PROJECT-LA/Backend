import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString, PaginationQueryDto } from '@app/common'

export class FilterModuleDto extends PaginationQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly section: boolean
}

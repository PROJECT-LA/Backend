import { PaginationQueryDto } from '../../base'
import { IsOptional, IsString } from 'class-validator'

export class FilterUserDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  readonly idRole?: string
}

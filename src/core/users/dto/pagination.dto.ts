import { Transform } from 'class-transformer'
import { PaginationQueryDto } from 'src/common/dto/pagination.dto'

export class FilterUserDto extends PaginationQueryDto {
  @Transform(({ value }) => (value ? value.split(',') : null))
  readonly rol?: Array<string>
}

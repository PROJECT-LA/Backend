import { PaginationQueryDto } from '@app/common'
import { Transform } from 'class-transformer'
export class FilterUserDto extends PaginationQueryDto {
  @Transform(({ value }) => (value ? value.split(',') : null))
  readonly rol?: Array<string>
}

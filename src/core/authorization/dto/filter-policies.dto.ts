import { PaginationQueryDto } from 'src/common'

export class FilterPoliciesDto extends PaginationQueryDto {
  readonly aplication?: string
}

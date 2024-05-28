import { BaseInterfaceRepository, PaginationQueryDto } from '@app/common'
import { Parameter } from '../entity'

export interface ParameterRepositoryInterface
  extends BaseInterfaceRepository<Parameter> {
  list(paginationQueryDto: PaginationQueryDto)
}

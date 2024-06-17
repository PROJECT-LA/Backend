import { BaseInterfaceRepository, FilterTemplateDto } from '@app/common'
import { Personal } from '../entities'

export interface IPersonalRepository extends BaseInterfaceRepository<Personal> {
  list(paginationQueryDto: FilterTemplateDto): Promise<[Personal[], number]>
}

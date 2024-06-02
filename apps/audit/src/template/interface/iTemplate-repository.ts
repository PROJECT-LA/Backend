import { BaseInterfaceRepository, FilterTemplateDto } from '@app/common'
import { Template } from '../entities'

export interface ITemplateRepository extends BaseInterfaceRepository<Template> {
  list(paginationQueryDto: FilterTemplateDto): Promise<[Template[], number]>
}

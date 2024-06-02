import { BaseInterfaceRepository, FilterTemplateDto } from '@app/common'
import { Control } from '../entities'

export interface IControlRepository extends BaseInterfaceRepository<Control> {
  list(paginationQueryDto: FilterTemplateDto): Promise<[Control[], number]>
}

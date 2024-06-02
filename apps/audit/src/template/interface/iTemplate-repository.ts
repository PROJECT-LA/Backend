import { FilterUserDto } from '../dto'
import { BaseInterfaceRepository } from '@app/common'
import { Template } from '../entities'

export interface TemplateRepositoryInterface
  extends BaseInterfaceRepository<Template> {
  list(paginationQueryDto: FilterUserDto): Promise<[Template[], number]>
}

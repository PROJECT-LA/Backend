import { BaseInterfaceRepository, FilterTemplateDto } from '@app/common'
import { ControlGroup } from '../entities/control-group.entity'

export interface IControlGroupRepository
  extends BaseInterfaceRepository<ControlGroup> {
  list(paginationQueryDto: FilterTemplateDto): Promise<[ControlGroup[], number]>
}

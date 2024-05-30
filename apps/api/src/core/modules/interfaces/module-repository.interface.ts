import { BaseInterfaceRepository } from '@app/common'
import { FilterModuleDto } from '../dto'
import { ModuleEntity } from '../entities'

export interface ModuleRepositoryInterface
  extends BaseInterfaceRepository<ModuleEntity> {
  list(paginationQueryDto: FilterModuleDto)
  getModuleSubModules(id: string)
}

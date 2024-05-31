import { BaseInterfaceRepository } from '@app/common'
import { ModuleEntity } from '../entities'

export interface ModuleRepositoryInterface
  extends BaseInterfaceRepository<ModuleEntity> {
  getModuleSubModules(id: string)
  getSidebarByRole(id: string)
}

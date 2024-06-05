import { BaseInterfaceRepository } from '@app/common'
import { ModuleEntity } from '../entities'

export interface IModuleRepository
  extends BaseInterfaceRepository<ModuleEntity> {
  getModuleSubModules(id: string)
  getSidebarByRole(id: string)
  getOrderSectionByRole(id: string): Promise<number | null | undefined>
  getModuleOrderBySection(id: string): Promise<number | null | undefined>
}

import { BaseInterfaceRepository } from '@app/common'
import { ControlGroup } from '../entities/control-group.entity'

export interface IControlGroupRepository
  extends BaseInterfaceRepository<ControlGroup> {}

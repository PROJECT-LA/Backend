import { BaseInterfaceRepository } from '@app/common'
import { UserAudit } from '../entities'

export interface IUserAuditRepository
  extends BaseInterfaceRepository<UserAudit> {}

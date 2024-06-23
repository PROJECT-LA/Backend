import { BaseInterfaceRepository } from '@app/common'
import { Audit } from '../entities/audit.entity'

export interface IAuditRepository extends BaseInterfaceRepository<Audit> {}

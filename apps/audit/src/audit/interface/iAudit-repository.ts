import { BaseInterfaceRepository, FilterTemplateDto } from '@app/common'
import { Audit } from '../entities/audit.entity'

export interface IAuditRepository extends BaseInterfaceRepository<Audit> {
  list(paginationQueryDto: FilterTemplateDto): Promise<[Audit[], number]>
}

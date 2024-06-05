import { BaseInterfaceRepository } from '@app/common'
import { Role } from '../entities'
import { FilterRoleDto } from '../dto'

export interface IRoleRepository extends BaseInterfaceRepository<Role> {
  list(paginationQueryDto: FilterRoleDto): Promise<[Role[], number]>
}

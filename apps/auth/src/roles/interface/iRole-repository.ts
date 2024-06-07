import { BaseInterfaceRepository, FilterRoleDto } from '@app/common'
import { Role } from '../entities'

export interface IRoleRepository extends BaseInterfaceRepository<Role> {
  list(paginationQueryDto: FilterRoleDto): Promise<[Role[], number]>
}

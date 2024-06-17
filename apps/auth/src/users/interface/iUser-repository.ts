import { User } from '../entities'
import { BaseInterfaceRepository, FilterUserDto } from '@app/common'

export interface IUserRepository extends BaseInterfaceRepository<User> {
  list(paginationQueryDto: FilterUserDto): Promise<[User[], number]>
  validateCredentials(username: string): Promise<User>
  getUsersByRole(id: string): Promise<User[]>
}

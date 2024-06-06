import { User } from '../entities'
import { FilterUserDto } from '../dto'
import { BaseInterfaceRepository } from '@app/common'

export interface IUserRepository extends BaseInterfaceRepository<User> {
  list(paginationQueryDto: FilterUserDto): Promise<[User[], number]>
  validateCredentials(username: string): Promise<User>
}
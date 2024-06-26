import { User } from '../entities'
import { BaseInterfaceRepository } from '@app/common'

export interface IUserRepository extends BaseInterfaceRepository<User> {}

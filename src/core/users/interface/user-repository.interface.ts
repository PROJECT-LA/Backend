import { BaseAbstractRepostitory } from 'src/common/abstract/base.repository'
import { User } from '../entities'

export interface UsersRepositoryInterface
  extends BaseAbstractRepostitory<User> {}

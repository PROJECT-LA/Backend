import { SetMetadata } from '@nestjs/common'
import { RolEEnum } from '../constants'

export const ROLES_KEY = 'roles'
export const Roles = (...roles: RolEEnum[]) => SetMetadata(ROLES_KEY, roles)

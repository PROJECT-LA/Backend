import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { AUTHZ_ENFORCER } from 'nest-authz'
import { Request } from 'express'
import { Enforcer } from 'casbin/lib/cjs/enforcer'
import { PassportUser } from 'src/common'

@Injectable()
export class CasbinGuard implements CanActivate {
  constructor(@Inject(AUTHZ_ENFORCER) private enforcer: Enforcer) {}

  async canActivate(context: ExecutionContext) {
    const {
      originalUrl,
      query,
      route,
      method: action,
    } = context.switchToHttp().getRequest() as Request
    const resource = Object.keys(query).length ? route.path : originalUrl
    const user = context.switchToHttp().getRequest().user as PassportUser
    if (!user) {
      throw new UnauthorizedException()
    }

    if (!user.roleName || !user.idRole) {
      throw new UnauthorizedException()
    }

    const isPermitted = await this.enforcer.enforce(
      user.roleName,
      resource,
      action
    )

    if (isPermitted) {
      return true
    }

    throw new ForbiddenException('Permisos insuficientes (CASBIN)', {
      cause: `CASBIN ${action} ${resource} -> false`,
    })
  }
}

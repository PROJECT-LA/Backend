import { AUTH_SERVICE } from '@app/common'
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { Request } from 'express'

@Injectable()
export class CasbinGuard implements CanActivate {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}

  async canActivate(context: ExecutionContext) {
    const {
      originalUrl,
      query,
      route,
      method: action,
    } = context.switchToHttp().getRequest() as Request
    const resource = Object.keys(query).length ? route.path : originalUrl
    const user = context.switchToHttp().getRequest().user
    if (!user) throw new UnauthorizedException()
    if (!user.roleName || !user.idRole) throw new UnauthorizedException()

    const result = await this.authClient
      .send(
        { cmd: 'casbin' },
        {
          idRole: user.idRole,
          resource,
          action,
        },
      )
      .pipe()
      .toPromise()
    if (result) return true

    throw new ForbiddenException('Permisos insuficientes (CASBIN) ', {
      cause: `CASBIN ${action} ${resource} -> false`,
    })
  }
}

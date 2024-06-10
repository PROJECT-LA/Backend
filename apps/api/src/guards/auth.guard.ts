import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common'
import { Observable, throwError } from 'rxjs'
import { ClientProxy, RpcException } from '@nestjs/microservices'
import { catchError, map, tap } from 'rxjs/operators'
import { AUTH_SERVICE, VERIFY_TOKEN } from '@app/common'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()
    const authHeader = request.headers['authorization']
    if (!authHeader) throw new ForbiddenException('No autorizado')

    const authHeaderParts = (authHeader as string).split(' ')
    if (authHeaderParts.length !== 2) throw new ForbiddenException('sin token')
    const [, jwt] = authHeaderParts

    if (!jwt) {
      throw new ForbiddenException('No autorizado')
    }

    return this.authClient.send({ cmd: VERIFY_TOKEN }, { jwt }).pipe(
      tap((res) => {
        request.user = res
      }),
      map(() => true),
      catchError((error) => throwError(() => new RpcException(error.response))),
    )
  }
}

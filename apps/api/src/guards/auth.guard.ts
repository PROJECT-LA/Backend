import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common'
import { Observable, of } from 'rxjs'
import { ClientProxy } from '@nestjs/microservices'
import { catchError, map, tap } from 'rxjs/operators'
import { AUTH_SERVICE } from '@app/common'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()
    const authHeader = request.headers['authorization']
    if (!authHeader) return false

    const authHeaderParts = (authHeader as string).split(' ')
    if (authHeaderParts.length !== 2) return false
    const [, jwt] = authHeaderParts

    if (!jwt) {
      return false
    }

    return this.authClient.send({ cmd: 'verify-jwt' }, { jwt }).pipe(
      tap((res) => {
        request.user = res
      }),
      map(() => true),
      catchError(() => of(false)),
    )
  }
}

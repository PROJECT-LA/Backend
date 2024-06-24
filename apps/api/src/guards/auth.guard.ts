import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { Observable, throwError } from 'rxjs'
import { ClientProxy, RpcException } from '@nestjs/microservices'
import { catchError, map, tap } from 'rxjs/operators'
import { AUTH_SERVICE, AuthMessages } from '@app/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
    private readonly configService: ConfigService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()
    const jwtCookieName = this.configService.getOrThrow('JWT_COOKIE')
    const jwt = request.cookies[jwtCookieName]

    if (!jwt) {
      throw new UnauthorizedException('No autorizado')
    }

    return this.authClient
      .send({ cmd: AuthMessages.VERIFY_TOKEN }, { jwt })
      .pipe(
        tap((res) => {
          request.user = res
        }),
        map(() => true),
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      )
  }
}

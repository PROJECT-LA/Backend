import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { catchError, Observable, throwError } from 'rxjs'

@Injectable()
export class UnauthorizedInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof UnauthorizedException) {
          const httpContext = context.switchToHttp()
          const response = httpContext.getResponse()
          const jwtCookieName = this.configService.getOrThrow('JWT_COOKIE')
          const rftCookieName = this.configService.getOrThrow('RFT_COOKIE')
          response.clearCookie(jwtCookieName).clearCookie(rftCookieName)
        }
        return throwError(() => error)
      }),
    )
  }
}

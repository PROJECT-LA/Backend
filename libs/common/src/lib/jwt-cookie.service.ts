import { CookieOptions } from 'express-serve-static-core'
import { ConfigService } from '@nestjs/config'

export class JwtCookieService {
  static makeConfig(configService: ConfigService): CookieOptions {
    return {
      secure: configService.getOrThrow('JWT_SECURE') === 'true',
      path: configService.getOrThrow('JWT_PATH'),
    }
  }
}

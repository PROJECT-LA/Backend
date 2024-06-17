import { CookieOptions } from 'express-serve-static-core'
import { ConfigService } from '@nestjs/config'

export class JwtCookieService {
  static makeConfig(configService: ConfigService): CookieOptions {
    const expiresIn = configService.getOrThrow('JWT_EXPIRES')
    const ttl = parseInt(expiresIn, 10)
    const expirationDate = new Date(Date.now() + ttl)
    return {
      secure: configService.getOrThrow('JWT_SECURE') === 'true',
      path: configService.getOrThrow('JWT_PATH'),
      expires: expirationDate,
    }
  }
}

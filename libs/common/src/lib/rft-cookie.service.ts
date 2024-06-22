import { CookieOptions } from 'express-serve-static-core'
import { ConfigService } from '@nestjs/config'

export class RefreshTokenCookieService {
  static makeConfig(configService: ConfigService): CookieOptions {
    const expiresIn = configService.getOrThrow('RFT_EXPIRES_IN')
    const ttl = parseInt(expiresIn, 10)
    const expirationDate = new Date(Date.now() + ttl)

    return {
      httpOnly: true,
      secure: configService.get('RFT_SECURE') === 'true',
      expires: expirationDate,
      path: configService.get('RFT_PATH'),
    }
  }
}

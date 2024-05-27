import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportUser } from '@app/common'

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh',
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: configService.get('JWT_SECRET'),
    })
  }

  validate(payload: PassportUser): PassportUser {
    return {
      id: payload.id,
      roles: payload.roles,
      idRole: payload.idRole,
      roleName: payload.roleName,
      exp: payload.exp,
      iat: payload.iat,
    }
  }
}

import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportUser } from '@app/common'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
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

import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { Strategy } from 'passport-local'
import { AuthService } from '../auth.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'username',
      paswordField: 'password',
    })
  }

  async validate(username: string, password: string) {
    const user = await this.authService.validateUser(username, password)
    if (!user) throw new UnauthorizedException('No autorizado')
    return user
  }
}

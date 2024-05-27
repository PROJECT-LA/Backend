import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { Strategy } from 'passport-local'
import { AuthService } from '../service'
import { Messages, PassportUser } from '@app/common'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'username',
      paswordField: 'password',
    })
  }

  async validate(username: string, password: string): Promise<PassportUser> {
    const user = await this.authService.validateCredentials(username, password)
    if (!user) throw new UnauthorizedException(Messages.EXCEPTION_UNAUTHORIZED)
    return {
      id: user.id,
      roles: user.roles,
    }
  }
}

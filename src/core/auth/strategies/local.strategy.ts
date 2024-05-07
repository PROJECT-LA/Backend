import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { Strategy } from 'passport-local'
import { UserService } from 'src/core/users'
import { Messages } from 'src/common/constants'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private userService: UserService) {
    super({
      usernameField: 'username',
      paswordField: 'password',
    })
  }

  async validate(username: string, password: string) {
    const user = await this.userService.validateUser(username, password)
    if (!user) throw new UnauthorizedException(Messages.EXCEPTION_UNAUTHORIZED)
    return { id: user.id, roles: user.roles }
  }
}

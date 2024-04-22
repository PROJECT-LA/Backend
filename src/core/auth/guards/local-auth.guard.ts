import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext) {
    try {
      const isPermitted = (await super.canActivate(context)) as boolean
      if (!isPermitted) throw new UnauthorizedException()
    } catch (err) {
      throw new UnauthorizedException()
    }

    return true
  }
}

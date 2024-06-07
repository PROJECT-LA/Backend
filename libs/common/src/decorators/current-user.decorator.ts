import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { PassportUser } from '@app/common'

export const getCurrentUserByContext = (
  context: ExecutionContext,
): PassportUser => {
  if (context.getType() === 'http') {
    const request = context.switchToHttp().getRequest()
    if (!request.user) {
      throw new UnauthorizedException('User not authenticated')
    }
    return request.user
  }
  if (context.getType() === 'rpc') {
    const data = context.switchToRpc().getData()
    if (!data.user) {
      throw new UnauthorizedException('User not authenticated')
    }
    return data.user
  }
  throw new UnauthorizedException('Unsupported context type')
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
)

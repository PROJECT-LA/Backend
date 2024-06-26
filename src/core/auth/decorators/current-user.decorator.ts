/* import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { User } from 'src/core/users'

export const getCurrentUserByContext = (context: ExecutionContext): User => {
  if (context.getType() === 'http') {
    return context.switchToHttp().getRequest().user
  }
  if (context.getType() === 'rpc') {
    return context.switchToRpc().getData().user
  }
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context)
)
 */

import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { PassportUser } from 'src/common'
export const getCurrentUserByContext = (
  context: ExecutionContext
): PassportUser => {
  if (context.getType() === 'http') {
    return context.switchToHttp().getRequest().user
  }
  if (context.getType() === 'rpc') {
    return context.switchToRpc().getData().user
  }
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context)
)

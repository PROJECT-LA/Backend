/* import { Catch, ArgumentsHost, HttpStatus } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import { Response } from 'express'

@Catch(RpcException)
export class RpcExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const message = exception.message

    const status = HttpStatus.CONFLICT

    response.status(status).json({
      statusCode: status,
      message: message,
    })
  }
}
 */
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import { Response } from 'express'

@Catch(RpcException)
export class RpcExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const error: any = exception.getError()
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    response.status(error.statusCode).json(error)
  }
}
/* import { Controller, Get, Inject } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { ClientProxy, RpcException } from '@nestjs/microservices'
import { catchError, throwError, timeout } from 'rxjs'
import { AUDIT_SERVICE, AUTH_SERVICE, FILE_SERVICE } from '@app/common'

@ApiTags('HealtCheck')
@Controller('healtcheck')
export class ApiController {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authService: ClientProxy,
    @Inject(FILE_SERVICE) private readonly fileService: ClientProxy,
    @Inject(AUDIT_SERVICE) private readonly auditService: ClientProxy,
  ) {}

  @ApiOperation({
    summary: 'API para obtener respuesta de healtcheck de app auth',
  })
  @Get('auth')
  async healtAuth() {
    try {
      const result = await this.authService
        .send({ cmd: PING }, {})
        .pipe(
          timeout(2000),
          catchError((error) =>
            throwError(() => new RpcException(error.response)),
          ),
        )
        .toPromise()
      return { status: 'up', result }
    } catch (error) {
      return { status: 'down', error }
    }
  }

  @ApiOperation({
    summary: 'API para obtener respuesta de healtcheck de app files',
  })
  @Get('files')
  async healtFiles() {
    try {
      const result = await this.fileService
        .send({ cmd: PING }, {})
        .pipe(
          timeout(2000),
          catchError((error) =>
            throwError(() => new RpcException(error.response)),
          ),
        )
        .toPromise()
      return { status: 'up', result }
    } catch (error) {
      return { status: 'down', error }
    }
  }

  @ApiOperation({
    summary: 'API para obtener respuesta de healtcheck de app files',
  })
  @Get('audit')
  async healtAudit() {
    try {
      const result = await this.auditService
        .send({ cmd: PING }, {})
        .pipe(
          timeout(2000),
          catchError((error) =>
            throwError(() => new RpcException(error.response)),
          ),
        )
        .toPromise()
      return { status: 'up', result }
    } catch (error) {
      return { status: 'down', error }
    }
  }
}
 */

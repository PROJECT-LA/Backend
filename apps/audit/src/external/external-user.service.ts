import { Inject, Injectable } from '@nestjs/common'
import {
  AUTH_SERVICE,
  AuthMessages,
  ParamIdDto,
  UserMessages,
} from '@app/common'
import { ClientProxy, RpcException } from '@nestjs/microservices'
import { catchError, lastValueFrom, of, timeout } from 'rxjs'

@Injectable()
export class ExternalUserService {
  constructor(
    @Inject(AUTH_SERVICE)
    private readonly authService: ClientProxy,
  ) {}

  async isServiceAvaliable(): Promise<boolean> {
    try {
      const result = await lastValueFrom(
        this.authService.send({ cmd: AuthMessages.PING }, {}).pipe(
          timeout(500),
          catchError((error) => {
            console.log(error)
            return of(false)
          }),
        ),
      )
      return result
    } catch (error) {
      console.error(
        'Error inesperado al verificar la disponibilidad del servicio:',
        error,
      )
      return false
    }
  }

  async getUser(id: string) {
    const param = new ParamIdDto()
    param.id = id
    const res = await this.isServiceAvaliable()
    if (!res) {
      throw new RpcException(new Error('Servicio no disponible'))
    }
    const result = await lastValueFrom(
      this.authService.send({ cmd: UserMessages.GET_USER }, { param }),
    )
    return result
  }
}

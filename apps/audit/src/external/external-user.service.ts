import { Inject, Injectable } from '@nestjs/common'
import {
  AUTH_SERVICE,
  AuthMessages,
  ParamIdDto,
  UserMessages,
} from '@app/common'
import { ClientProxy } from '@nestjs/microservices'
import { catchError, lastValueFrom, of, timeout } from 'rxjs'

@Injectable()
export class ExternalUserService {
  constructor(
    @Inject(AUTH_SERVICE)
    private readonly fileService: ClientProxy,
  ) {}

  async isServiceAvaliable(): Promise<boolean> {
    try {
      const result = await lastValueFrom(
        this.fileService.send({ cmd: AuthMessages.PING }, {}).pipe(
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
    if (res) {
      const result = await lastValueFrom(
        this.fileService.send({ cmd: UserMessages.GET_USER }, { param }),
      )
      return result
    }
  }
}

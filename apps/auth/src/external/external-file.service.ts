import { Inject, Injectable, ServiceUnavailableException } from '@nestjs/common'
import { AvatarMessages, FILE_SERVICE, FilesMessages } from '@app/common'
import { ClientProxy, RpcException } from '@nestjs/microservices'
import { catchError, lastValueFrom, of, timeout } from 'rxjs'

@Injectable()
export class ExternalFileService {
  constructor(
    @Inject(FILE_SERVICE)
    private readonly fileService: ClientProxy,
  ) {}

  async isServiceAvaliable(): Promise<boolean> {
    try {
      const result = await lastValueFrom(
        this.fileService.send({ cmd: FilesMessages.PING }, {}).pipe(
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

  async writteImage(image: Express.Multer.File, name: string) {
    const isAvailable = await this.isServiceAvaliable()
    if (!isAvailable) {
      throw new RpcException(
        new ServiceUnavailableException(
          'El servicio de archivos no está disponible en este momento.',
        ),
      )
    }

    const result = await lastValueFrom(
      this.fileService.send(
        { cmd: AvatarMessages.UPLOAD_AVATAR },
        { file: image, fileName: name },
      ),
    )
    return result
  }

  async getImage(name: string) {
    const res = await this.isServiceAvaliable()
    if (res) {
      const result = await lastValueFrom(
        this.fileService.send({ cmd: AvatarMessages.GET_AVATAR }, { name }),
      )
      return result
    }
  }
}

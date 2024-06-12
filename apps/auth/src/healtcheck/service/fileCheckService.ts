import { Inject, Injectable } from '@nestjs/common'
import { FILE_SERVICE, FilesMessages } from '@app/common'
import { ClientProxy } from '@nestjs/microservices'
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
    const res = await this.isServiceAvaliable()
    if (res) {
      const result = await lastValueFrom(
        this.fileService.send(
          { cmd: 'writte-avatar' },
          { file: image, fileName: name },
        ),
      )
      return result
    }
    return false
  }

  async getImage(name: string) {
    const res = await this.isServiceAvaliable()
    if (res) {
      const result = await lastValueFrom(
        this.fileService.send({ cmd: 'writte-avatar' }, { name }),
      )
      return result
    }
  }
}

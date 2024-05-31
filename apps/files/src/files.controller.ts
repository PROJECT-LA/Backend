import { SharedService } from '@app/common'
import { Controller, Param, Delete, Inject } from '@nestjs/common'
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices'
import { extname } from 'path'
import { FileService } from './file.service'

@Controller('files')
export class FileController {
  constructor(
    private readonly fileService: FileService,
    @Inject('SharedServiceInterface')
    private readonly sharedService: SharedService,
  ) {}

  @MessagePattern({ cmd: 'writte-avatar' })
  async uploadAvatar(
    @Ctx() context: RmqContext,
    @Payload()
    { file, fileName }: { file: Express.Multer.File; fileName: string },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const extension = extname(file.originalname).slice(1)
    return this.fileService.writteAvatars(`${fileName}.${extension}`, file)
  }

  @MessagePattern({ cmd: 'get-avatar' })
  async getAvatarBase64(
    @Ctx() context: RmqContext,
    @Payload() { name }: { name: string },
  ) {
    this.sharedService.acknowledgeMessage(context)
    return this.fileService.getAvatar(name)
    // streamableFile.stream.pipe(res)
  }
  @Delete(':name')
  deleteFile(@Param('name') name: string) {
    this.fileService.removeFile('ruta/del/archivo', name)
  }
}

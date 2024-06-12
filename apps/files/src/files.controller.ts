import { AvatarMessagess, FilesMessages, SharedService } from '@app/common'
import { Controller, Param, Inject } from '@nestjs/common'
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

  @MessagePattern({ cmd: FilesMessages.PING })
  async serviceStatus(@Ctx() context: RmqContext) {
    this.sharedService.acknowledgeMessage(context)
    return 'pong'
  }

  @MessagePattern({ cmd: AvatarMessagess.UPLOAD_AVATAR })
  async uploadAvatar(
    @Ctx() context: RmqContext,
    @Payload()
    { file, fileName }: { file: Express.Multer.File; fileName: string },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const extension = extname(file.originalname).slice(1)
    return this.fileService.writteAvatars(`${fileName}.${extension}`, file)
  }

  @MessagePattern({ cmd: AvatarMessagess.GET_AVATAR })
  async getAvatarBase64(
    @Ctx() context: RmqContext,
    @Payload() { name }: { name: string },
  ) {
    this.sharedService.acknowledgeMessage(context)
    return this.fileService.getAvatar(name)
  }

  @MessagePattern({ cmd: AvatarMessagess.DELETE_AVATAR })
  deleteFile(@Param('name') name: string) {
    this.fileService.removeFile('ruta/del/archivo', name)
  }
}

import { AvatarMessagess, FilesMessages, SharedService } from '@app/common'
import { Controller, Inject } from '@nestjs/common'
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices'
import { extname } from 'path'
import { DocsService } from './docs.service'

@Controller('files')
export class DocsController {
  constructor(
    private readonly docService: DocsService,
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
    return this.docService.writteDoc(`${fileName}.${extension}`, file)
  }

  @MessagePattern({ cmd: 'get-fo' })
  async getAvatarBase64(
    @Ctx() context: RmqContext,
    @Payload() { name }: { name: string },
  ) {
    this.sharedService.acknowledgeMessage(context)
    return this.docService.getDoc(name)
  }

  @MessagePattern({ cmd: AvatarMessagess.DELETE_AVATAR })
  async deleteFile(
    @Ctx() context: RmqContext,
    @Payload() { name }: { name: string },
  ) {
    this.sharedService.acknowledgeMessage(context)
    return await this.docService.removeDoc(name)
  }
}

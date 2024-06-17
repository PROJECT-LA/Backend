import { AvatarMessages, SharedService } from '@app/common'
import { Controller, Inject } from '@nestjs/common'
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices'
import { extname } from 'path'
import { AvatarService } from './avatar.service'

@Controller('files')
export class AvatarController {
  constructor(
    private readonly avatarService: AvatarService,
    @Inject('SharedServiceInterface')
    private readonly sharedService: SharedService,
  ) {}

  @MessagePattern({ cmd: AvatarMessages.UPLOAD_AVATAR })
  async uploadAvatar(
    @Ctx() context: RmqContext,
    @Payload()
    { file, fileName }: { file: Express.Multer.File; fileName: string },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const extension = extname(file.originalname).slice(1)
    return this.avatarService.writteAvatars(`${fileName}.${extension}`, file)
  }

  @MessagePattern({ cmd: AvatarMessages.GET_AVATAR })
  async getAvatarBase64(
    @Ctx() context: RmqContext,
    @Payload() { name }: { name: string },
  ) {
    this.sharedService.acknowledgeMessage(context)
    return this.avatarService.getAvatar(name)
  }

  @MessagePattern({ cmd: AvatarMessages.DELETE_AVATAR })
  async deleteFile(
    @Ctx() context: RmqContext,
    @Payload() { name }: { name: string },
  ) {
    this.sharedService.acknowledgeMessage(context)
    return await this.avatarService.removeAvatar(name)
  }
}

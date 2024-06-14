import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { FileService } from '../global/file.service'
@Injectable()
export class AvatarService {
  constructor(
    private readonly configService: ConfigService,
    private readonly fileService: FileService,
  ) {}

  async writteAvatars(name: string, buffer: Express.Multer.File) {
    const route = this.configService.get<string>('AVATARS_PATH')
    return await this.fileService.writeToFile(name, buffer.buffer, route)
  }

  async removeAvatar(name: string) {
    const route = this.configService.get<string>('AVATARS_PATH')
    return this.fileService.removeFile(route, name)
  }

  async getAvatar(name: string) {
    const route = this.configService.get<string>('AVATARS_PATH')
    return this.fileService.fileToBase64(route, name)
  }
}

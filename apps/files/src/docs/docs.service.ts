import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { FileService } from '../global/file.service'
@Injectable()
export class DocsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly fileService: FileService,
  ) {}

  async writteDoc(name: string, buffer: Express.Multer.File) {
    const route = this.configService.get<string>('AVATARS_PATH')
    return await this.fileService.writeToFile(name, buffer.buffer, route)
  }

  async removeDoc(name: string) {
    const route = this.configService.get<string>('AVATARS_PATH')
    return this.fileService.removeFile(route, name)
  }

  async getDoc(name: string) {
    const route = this.configService.get<string>('AVATARS_PATH')
    return this.fileService.fileToBase64(route, name)
  }
}

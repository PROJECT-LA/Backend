import { SharedService } from '@app/common'
import { Controller, Get, Param, Res, Delete, Inject } from '@nestjs/common'
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices'
import { Response } from 'express'
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
    console.log(file)
    console.log(fileName)
    this.sharedService.acknowledgeMessage(context)
    const extension = extname(file.originalname).slice(1)
    return this.fileService.writteAvatars(`${fileName}.${extension}`, file)
  }

  @Get(':name')
  async getFile(@Param('name') name: string, @Res() res: Response) {
    const streamableFile = this.fileService.readFile(
      'ruta/del/directorio/',
      name,
    )
    // streamableFile.stream.pipe(res)
  }
  @Delete(':name')
  deleteFile(@Param('name') name: string) {
    this.fileService.removeFile('ruta/del/archivo', name)
  }
}

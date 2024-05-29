import { Controller, Inject } from '@nestjs/common'
import { FilesService } from './files.service'
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices'
import { SharedService } from '@app/common'

@Controller()
export class FilesController {
  constructor(
    private readonly fileService: FilesService,
    @Inject('SharedServiceInterface')
    private readonly sharedService: SharedService,
  ) {}

  @MessagePattern({ cmd: 'write-files-avatars' })
  async writteFile(@Ctx() context: RmqContext, @Payload() {image,name}:{image:Express.Multer.File, name:string}) {
   this.fileService.writeFile('path',name,image)
  }
   
  @MessagePattern({ cmd: 'remove-files-avatars' })
}

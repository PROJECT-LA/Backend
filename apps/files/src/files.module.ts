import { Module } from '@nestjs/common'
import { SharedModule, SharedService } from '@app/common'
import { ConfigModule } from '@nestjs/config'
import { FileController } from './files.controller'
import { FileService } from './file.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SharedModule,
  ],
  controllers: [FileController],
  providers: [
    FileService,
    {
      provide: 'SharedServiceInterface',
      useClass: SharedService,
    },
  ],
})
export class FilesModule {}

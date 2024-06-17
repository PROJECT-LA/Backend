import { Module } from '@nestjs/common'
import { SharedModule, SharedService } from '@app/common'
import { ConfigModule } from '@nestjs/config'
import { FileService } from './global/file.service'
import { AvatarController } from './avatars/avatar.controller'
import { AvatarService } from './avatars/avatar.service'
import { HealthCheckFileController } from './external/health-check.controller'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SharedModule,
  ],
  controllers: [AvatarController, HealthCheckFileController],
  providers: [
    FileService,
    AvatarService,
    {
      provide: 'SharedServiceInterface',
      useClass: SharedService,
    },
  ],
})
export class FilesAppModule {}
